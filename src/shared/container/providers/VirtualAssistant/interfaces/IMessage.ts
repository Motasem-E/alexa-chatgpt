import SpeakerEnum from '../types/SpeakerEnum';

interface IMessage {
  role: SpeakerEnum;
  content: string;
}

export default IMessage;
