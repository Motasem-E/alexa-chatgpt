interface IChatGptResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    {
      text: string;
      index: number;
      logprobs: string;
      finish_reason: string;
    },
  ];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export default IChatGptResponse;
