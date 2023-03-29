import { HandlerInput } from 'ask-sdk-core';

type IGetSpeakText = ({ handlerInput, en, pt }: { handlerInput: HandlerInput; en: string; pt: string }) => string;

export default IGetSpeakText;
