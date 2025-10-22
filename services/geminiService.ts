import { GoogleGenAI, Type } from "@google/genai";
import { Book } from '../types';

// This is a placeholder for a real API key, which should be stored in environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API-ключ Gemini не найден. Рекомендации не будут работать.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateRecommendations = async (readBooks: Book[]): Promise<{ title: string; details: string[] }[]> => {
  if (!API_KEY) {
    // Возвращаем моковые данные, если API-ключ недоступен
    return Promise.resolve([
      { "title": "Похитительница звездной пыли", "details": ["Торговец магическими реликвиями, вынужденный отправиться в опасное путешествие.", "Фэнтези", "2022"] },
      { "title": "Проект «Аве Мария»", "details": ["Астронавт с амнезией просыпается на одиночной миссии по спасению Земли.", "Научная фантастика", "2021"] },
    ]);
  }

  const bookList = readBooks.map(b => `- ${b.title} (автор жанра ${b.genres.join(', ')})`).join('\n');

  const prompt = `На основе следующего списка прочитанных мною книг, пожалуйста, порекомендуй 5 других книг. Для каждой книги укажи одно предложение с описанием, основной жанр и год публикации.

Мои прочитанные книги:
${bookList}

Предоставь рекомендации в структурированном формате.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Название рекомендованной книги.",
              },
              details: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "Массив, содержащий описание в одно предложение, жанр и год публикации в виде строк.",
              },
            },
            required: ["title", "details"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const recommendations = JSON.parse(jsonString) as { title: string; details: string[] }[];
    return recommendations;
  } catch (error) {
    console.error("Ошибка при генерации рекомендаций:", error);
    // Возвращаем моковые данные при ошибке API
    return [
      { "title": "Приорат апельсинового дерева", "details": ["Мир драконов, королев и магов.", "Фэнтези", "2019"] },
      { "title": "Дюна", "details": ["Благородная семья сражается за контроль над пустынной планетой.", "Научная фантастика", "1965"] },
    ];
  }
};