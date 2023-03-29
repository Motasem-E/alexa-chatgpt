interface IChatbotProvider {
  prompt(query: string): Promise<string>;
}

export default IChatbotProvider;
