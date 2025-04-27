import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, githubRepoUrl } = body;
    
    // Kiểm tra API key
    if (!key) {
      return NextResponse.json(
        { message: 'API key is required' },
        { status: 400 }
      );
    }

    // Kiểm tra githubRepoUrl
    if (!githubRepoUrl) {
      return NextResponse.json(
        { message: 'GitHub repository URL is required' },
        { status: 400 }
      );
    }
    
    // Xác thực API key từ Supabase
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Lỗi Supabase:', error);
      return NextResponse.json(
        { message: 'Server error during API key validation' },
        { status: 500 }
      );
    }
    
    // Nếu không tìm thấy key
    if (!data) {
      return NextResponse.json(
        { message: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Cập nhật số lần sử dụng và thời gian sử dụng cuối
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({
        usage: (data.usage || 0) + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', data.id);
    
    if (updateError) {
      console.warn('Không thể cập nhật thông tin sử dụng API key:', updateError);
    }
    
    // Fetch repo info first
    const repoInfo = await getRepoInfo(githubRepoUrl);

    // Then run summarization in parallel with other tasks
    const [summary] = await Promise.all([
      summarizeReadme(repoInfo.readmeContent),
      // Add any other parallel tasks here if needed
    ]);

    // Combine results for final response
    const summaryResult = {
      repositoryUrl: githubRepoUrl,
      repoInfo: {
        name: repoInfo.name,
        description: repoInfo.description,
        stars: repoInfo.stars,
        forks: repoInfo.forks,
        lastCommit: repoInfo.lastCommit,
        languages: repoInfo.languages,
        primaryLanguage: repoInfo.primaryLanguage,
      },
      summary: summary,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      message: 'Success',
      data: summaryResult
    });
  } catch (error) {
    console.error('Lỗi khi xử lý yêu cầu:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
} 

async function getRepoInfo(githubRepoUrl) {
  try {
    // Chuyển đổi URL thành định dạng API
    const [owner, repo] = githubRepoUrl
      .replace('https://github.com/', '')
      .replace('.git', '')
      .split('/');

    // Gọi GitHub API để lấy thông tin repo
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Node.js'
        }
      }
    );

    if (!repoResponse.ok) {
      throw new Error('Không thể lấy thông tin repository');
    }

    const repoData = await repoResponse.json();

    // Lấy thông tin ngôn ngữ
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Node.js'
        }
      }
    );

    const languagesData = await languagesResponse.json();
    const languages = Object.keys(languagesData);
    
    // Lấy nội dung README
    const readmeContent = await getReadmeContent(githubRepoUrl);

    return {
      name: repoData.name,
      description: repoData.description || 'Không có mô tả',
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      lastCommit: repoData.updated_at,
      languages: languages,
      primaryLanguage: languages.length > 0 ? languages[0] : 'Unknown',
      readmeContent: readmeContent
    };
  } catch (error) {
    console.error('Lỗi khi lấy thông tin repository:', error);
    // Trả về dữ liệu mặc định nếu không lấy được
    return {
      name: 'Unknown',
      description: 'Không thể lấy thông tin repository',
      stars: 0,
      forks: 0,
      lastCommit: new Date().toISOString(),
      languages: ['Unknown'],
      primaryLanguage: 'Unknown',
      readmeContent: 'Không có nội dung README'
    };
  }
}

async function getReadmeContent(githubRepoUrl) {
  try {
    // Chuyển đổi URL thành định dạng API
    const [owner, repo] = githubRepoUrl
      .replace('https://github.com/', '')
      .replace('.git', '')
      .split('/');

    // Gọi GitHub API để lấy nội dung README
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'Node.js'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Không thể lấy được nội dung README');
    }

    const readmeContent = await response.text();
    return readmeContent;

  } catch (error) {
    console.error('Lỗi khi lấy README từ GitHub:', error);
    return 'Không thể lấy nội dung README';
  }
}

async function summarizeReadme(readmeContent) {
  try {
    // Đây là phiên bản đơn giản để tạo tóm tắt
    // Trong thực tế, có thể sử dụng AI để tạo tóm tắt chất lượng hơn
    
    // Xử lý đơn giản: lấy 3 dòng đầu tiên không trống
    const lines = readmeContent.split('\n').filter(line => line.trim() !== '');
    const firstThreeLines = lines.slice(0, 3).join(' ');
    
    // Xử lý các heading markdown
    const cleanSummary = firstThreeLines
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .trim();
    
    return cleanSummary || 'Không thể tạo tóm tắt từ nội dung README';
  } catch (error) {
    console.error('Lỗi khi tóm tắt nội dung README:', error);
    return 'Không thể tạo tóm tắt';
  }
}


