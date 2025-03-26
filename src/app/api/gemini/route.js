import { NextResponse } from 'next/server';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

// 从环境变量获取API密钥
let GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// 配置代理
// 尝试两种代理方式
const socksProxyAgent = new SocksProxyAgent('socks://127.0.0.1:7890');
const httpsProxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890');

// 配置全局代理环境变量，这可能会对整个进程生效
process.env.HTTP_PROXY = 'http://127.0.0.1:7890';
process.env.HTTPS_PROXY = 'http://127.0.0.1:7890';
process.env.ALL_PROXY = 'socks5://127.0.0.1:7890';

export async function POST(request) {
  try {
    // 获取请求体
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: '缺少文本内容' }, { status: 400 });
    }
    
    // 检查API密钥
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API密钥未配置，请在.env.local文件中设置NEXT_PUBLIC_GEMINI_API_KEY' }, { status: 500 });
    }
    
    console.log('正在发送请求到Gemini API...');
    
    // 构建请求体
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `请优化以下简历内容，使其更专业、更有吸引力，同时保持内容的真实性。请只返回优化后的文本，不要包含任何额外的解释或评论：\n\n${text}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    // 尝试使用不同的代理方式，如果一种失败则尝试下一种
    let response;
    try {
      // 首先尝试使用SOCKS代理
      console.log('尝试使用SOCKS代理...');
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        agent: socksProxyAgent,
        timeout: 15000 // 15秒超时
      });
    } catch (error) {
      console.error('SOCKS代理失败，尝试HTTPS代理:', error.message);
      // 如果SOCKS代理失败，尝试HTTPS代理
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        agent: httpsProxyAgent,
        timeout: 15000 // 15秒超时
      });
    }
    
    console.log('Gemini API响应状态:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API错误:', errorData);
      return NextResponse.json({ error: '大模型处理失败' }, { status: response.status });
    }
    
    const data = await response.json();
    console.log('成功接收到Gemini API响应');
    
    // 提取优化后的文本
    const optimizedText = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ optimizedText });
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json({ error: `服务器内部错误: ${error.message}` }, { status: 500 });
  }
}

// 添加一个更新API密钥的端点
export async function PUT(request) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({ error: '缺少API密钥' }, { status: 400 });
    }
    
    // 更新API密钥
    GEMINI_API_KEY = apiKey;
    
    return NextResponse.json({ success: true, message: 'API密钥已更新' });
  } catch (error) {
    console.error('更新API密钥时出错:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
