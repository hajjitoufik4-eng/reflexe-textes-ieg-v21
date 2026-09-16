import FeedbackWidget from './components/FeedbackWidget';
import './feedback.css';

export default function Template({children}){
  return <>{children}<FeedbackWidget/></>;
}
