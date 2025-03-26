/**
 * 调用Gemini API优化简历文本
 * @param {string} text - 需要优化的文本
 * @returns {Promise<string>} - 优化后的文本
 */
export async function optimizeWithGemini(text) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '优化失败');
    }

    const data = await response.json();
    return data.optimizedText;
  } catch (error) {
    console.error('优化文本时出错:', error);
    throw error;
  }
}

/**
 * 更新Gemini API密钥
 * @param {string} apiKey - 新的API密钥
 * @returns {Promise<boolean>} - 是否更新成功
 */
export async function updateGeminiApiKey(apiKey) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '更新API密钥失败');
    }

    return true;
  } catch (error) {
    console.error('更新API密钥时出错:', error);
    throw error;
  }
}
