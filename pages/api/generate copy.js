import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const sign = req.body.sign || '';
  if (sign.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Zodiac sign",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(sign),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(sign) {
  const capitalizedSign =
    sign[0].toUpperCase() + sign.slice(1).toLowerCase();
  return `Write me a current-tense newspaper-quality horoscope for the zodiac sign requested. Followed by 5 Lucky numbers 0-60.

Sign: Leo
Horoscope: You are feeling confident and ready to take on new challenges today. Use your natural leadership skills to inspire those around you. Lucky Numbers: 0, 7, 11, 13, 27
Sign: Virgo
Horoscope: You may be feeling a little overwhelmed today, but don't let that stop you from being productive. Stay organized and focused on your goals. Lucky Numbers: 1, 17, 25, 42, 59
Sign: Aries
Horoscope: Your fiery spirit is shining bright today, making you the center of attention. Take advantage of this energy to tackle any obstacles in your way. Lucky Numbers: 4, 17, 21, 31, 57
Sign: ${capitalizedSign}
Horoscope: Lucky Numbers:`;
}
