import SpeakerEnum from './SpeakerEnum';

interface IMessage {
  role: SpeakerEnum;
  content: string;
}

export default IMessage;
