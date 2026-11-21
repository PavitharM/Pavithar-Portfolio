import { useEffect, useRef, useState } from 'react';
import { X, Send, MessageCircle, RotateCcw } from 'lucide-react';
import { answerPortfolioQuestion, suggestedQuestions } from './portfolioAnswers';
import './portfolio-assistant.css';

const greeting = { id: 0, role: 'guide', text: 'Hi! I’m Pavi’s little portfolio guide. Curious about his work? Pick a question below, or type one of your own.', links: [] };

function GuidePet() {
  return <svg className="guide-pet" viewBox="0 0 88 94" fill="none" aria-hidden="true">
    <ellipse cx="44" cy="87" rx="26" ry="4" fill="currentColor" opacity=".13"/>
    <g className="guide-pet-body">
      <path d="M44 21V13" stroke="#76B0CB" strokeWidth="3" strokeLinecap="round"/><circle cx="44" cy="10" r="5" fill="#9AD9EF"/>
      <path d="M22 61C19 65 17 71 19 74C22 77 28 71 30 67M66 61C71 65 74 60 75 54" stroke="#8FBAD1" strokeWidth="8" strokeLinecap="round"/>
      <rect x="25" y="53" width="38" height="28" rx="14" fill="#ADCFE1" stroke="#638EA8" strokeWidth="1.5"/>
      <path d="M30 79L27 83M58 79L61 83" stroke="#729DB5" strokeWidth="8" strokeLinecap="round"/>
      <rect x="12" y="21" width="64" height="45" rx="19" fill="#E2F2F9" stroke="#7CA7BE" strokeWidth="1.5"/>
      <rect x="19" y="28" width="50" height="30" rx="12" fill="#173E58"/>
      <g className="guide-pet-eyes"><rect x="29" y="36" width="6" height="10" rx="3" fill="#B1EDFF"/><rect x="53" y="36" width="6" height="10" rx="3" fill="#B1EDFF"/></g>
      <path d="M40 49Q44 52 48 49" stroke="#B1EDFF" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="44" cy="71" r="3" fill="#426F8A"/>
    </g>
  </svg>;
}

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([greeting]);
  const input = useRef(null);
  const launcher = useRef(null);
  const history = useRef(null);
  const nextId = useRef(1);
  const hasOpened = useRef(false);
  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      input.current?.focus({ preventScroll: true });
    } else if (hasOpened.current) launcher.current?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (history.current) history.current.scrollTop = history.current.scrollHeight;
  }, [messages, open]);
  function close() {
    setOpen(false);
  }
  function ask(question) {
    const text = question.trim();
    if (!text) return;
    const answer = answerPortfolioQuestion(text);
    const userId = nextId.current++;
    const guideId = nextId.current++;
    setMessages(previous => [...previous.slice(-28), { id: userId, role: 'visitor', text }, { id: guideId, role: 'guide', ...answer }]);
    setDraft('');
    input.current?.focus({ preventScroll: true });
  }
  return <aside className={`portfolio-guide ${open ? 'portfolio-guide--open' : ''}`} aria-label="Portfolio guide">
    {open && <div className="guide-panel" id="portfolio-guide-panel" role="dialog" aria-modal="false" aria-labelledby="portfolio-guide-title" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      <header className="guide-header"><div className="guide-header-pet"><GuidePet/></div><div><h2 id="portfolio-guide-title">Pavi’s guide</h2><p>Answers from this portfolio</p></div><div className="guide-header-controls"><button type="button" aria-label="Start a new conversation" title="Start over" onClick={() => { setMessages([greeting]); setDraft(''); input.current?.focus(); }}><RotateCcw size={16}/></button><button type="button" aria-label="Close portfolio guide" onClick={close}><X size={19}/></button></div></header>
      <div className="guide-messages" ref={history} role="log" aria-label="Portfolio conversation" aria-live="polite" aria-relevant="additions" tabIndex={0}>
        {messages.map(message => <div key={message.id} className={`guide-message guide-message--${message.role}`}><span className="guide-message-author">{message.role === 'guide' ? 'Pavi’s guide' : 'You'}</span><p>{message.text}</p>{message.links?.length > 0 && <div className="guide-answer-links">{message.links.map(link => <a key={link.href} href={link.href} target={link.href.startsWith('https:') ? '_blank' : undefined} rel={link.href.startsWith('https:') ? 'noreferrer' : undefined} onClick={() => { if (link.href.startsWith('#')) close(); }}>{link.label}</a>)}</div>}</div>)}
      </div>
      <div className="guide-suggestions"><span>Try a question</span><div>{suggestedQuestions.map(question => <button type="button" key={question} onClick={() => ask(question)}>{question}</button>)}</div></div>
      <form className="guide-form" onSubmit={event => { event.preventDefault(); ask(draft); }}><label className="guide-input-label" htmlFor="portfolio-question">Your portfolio question</label><input ref={input} id="portfolio-question" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask about Pavithar…" maxLength={300} autoComplete="off"/><button type="submit" aria-label="Send portfolio question" disabled={!draft.trim()}><Send size={18}/></button></form>
      <p className="guide-footnote">A topic-based guide to Pavithar’s work.</p>
    </div>}
    <button ref={launcher} type="button" className="guide-launcher" onClick={() => open ? close() : setOpen(true)} aria-label={open ? 'Close portfolio guide' : 'Ask Pavi’s portfolio guide'} aria-expanded={open} aria-controls="portfolio-guide-panel"><span className="guide-launcher-label"><MessageCircle size={15}/>{open ? 'Close chat' : 'Ask about my work'}</span><GuidePet/></button>
  </aside>;
}
