import React, { useContext, useState, useEffect } from 'react'
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

function Ai() {
    let {showSearch, setShowSearch} = useContext(shopDataContext);
    let navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (! SpeechRecognition) {
            console.log("Speech recognition not supported");
            return;
        }

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
            setIsListening(true);
            setTranscript('Listening...');
        };

        recognitionInstance.onresult = (e) => {
            const transcript = e.results[0][0].transcript. trim();
            setTranscript(transcript);
            handleCommand(transcript);
        };

        recognitionInstance.onerror = (e) => {
            console.error('Speech recognition error:', e. error);
            setIsListening(false);
            setTranscript('');
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
            setTimeout(() => setTranscript(''), 2000);
        };

        setRecognition(recognitionInstance);

        return () => {
            if (recognitionInstance) {
                recognitionInstance.abort();
            }
        };
    }, []);

    function speak(message) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance. volume = 1;
            window.speechSynthesis.speak(utterance);
        }
    }

    function handleCommand(transcript) {
        const command = transcript.toLowerCase();

        if (command. includes("search") && command.includes("open") && !showSearch) {
            speak("Opening search bar");
            setShowSearch(true);
            navigate("/collection");
        }
        else if (command.includes("search") && command.includes("close") && showSearch) {
            speak("Closing search bar");
            setShowSearch(false);
        }
        else if (command. includes("collection") || command.includes("collections") || 
                 command.includes("product") || command.includes("products")) {
            speak("Opening Collection Page");
            navigate("/collection");
        }
        else if (command.includes("about")) {
            speak("Opening About Page");
            navigate("/about");
            setShowSearch(false);
        }
        else if (command. includes("home")) {
            speak("Opening Home Page");
            navigate("/");
            setShowSearch(false);
        }
        else if (command. includes("cart") || command.includes("caat")) {
            speak("Opening Cart Page");
            navigate("/cart");
            setShowSearch(false);
        }
        else if (command.includes("contact")) {
            speak("Opening Contact Page");
            navigate("/contact");
            setShowSearch(false);
        }
        else if (command.includes("order") || command.includes("orders") || command.includes("my order")) {
            speak("Opening Order Page");
            navigate("/order");
            setShowSearch(false);
        }
        else {
            speak("Command not recognized.  Please try again.");
            console.log("Command not recognized:", transcript);
        }
    }

    const handleClick = () => {
        if (! recognition) {
            alert("Voice recognition not supported in your browser");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    return (
        <>
            {/* AI Assistant Button */}
            <div className='fixed lg:bottom-6 md:bottom-20 bottom-24 left-6 z-40'>
                <button
                    onClick={handleClick}
                    className='relative group'
                    title="AI Voice Assistant (Click to speak)"
                >
                    {/* Outer Glow Ring (when listening) */}
                    {isListening && (
                        <>
                            <div className='absolute inset-0 rounded-full bg-violet-600/50 animate-ping'></div>
                            <div className='absolute inset-0 rounded-full bg-purple-600/30 animate-pulse'></div>
                        </>
                    )}

                    {/* AI Assistant Container */}
                    <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl overflow-hidden ${
                        isListening
                            ? 'ring-4 ring-violet-500 ring-offset-2 ring-offset-slate-950'
                            : 'hover:scale-110'
                    }`}>
                        
                        {/* Background Gradient */}
                        <div className='absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600'></div>
                        
                        {/* AI Assistant SVG Icon */}
                        <svg 
                            className='relative w-12 h-12 text-white z-10' 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Robot Head */}
                            <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                            
                            {/* Antenna */}
                            <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="3" r="1. 5" fill="currentColor"/>
                            
                            {/* Eyes */}
                            <circle cx="9.5" cy="12" r="1.5" fill="currentColor"/>
                            <circle cx="14.5" cy="12" r="1.5" fill="currentColor"/>
                            
                            {/* Mouth (Smile) */}
                            <path d="M9 15 Q12 16.5 15 15" stroke="currentColor" strokeWidth="1. 5" strokeLinecap="round" fill="none"/>
                            
                            {/* Sound Waves (when listening) */}
                            {isListening && (
                                <>
                                    <path d="M3 12 Q3 12 3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6">
                                        <animate attributeName="d" values="M3 12 Q3 12 3 12;M3 10 Q3 12 3 14;M3 12 Q3 12 3 12" dur="1s" repeatCount="indefinite"/>
                                    </path>
                                    <path d="M21 12 Q21 12 21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6">
                                        <animate attributeName="d" values="M21 12 Q21 12 21 12;M21 10 Q21 12 21 14;M21 12 Q21 12 21 12" dur="1s" repeatCount="indefinite"/>
                                    </path>
                                </>
                            )}
                        </svg>

                        {/* Listening Indicator Dot */}
                        {isListening && (
                            <div className='absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white'></div>
                        )}
                    </div>
                </button>

                {/* Transcript Display */}
                {transcript && (
                    <div className='absolute bottom-24 left-0 bg-slate-900 border border-violet-600 rounded-lg px-4 py-3 shadow-xl min-w-[200px] max-w-[300px] animate-fade-in'>
                        <div className='flex items-start gap-2'>
                            {isListening && (
                                <div className='flex gap-0. 5 mt-1'>
                                    <div className='w-1 h-3 bg-violet-400 rounded-full animate-sound-wave'></div>
                                    <div className='w-1 h-3 bg-violet-400 rounded-full animate-sound-wave' style={{animationDelay: '0.2s'}}></div>
                                    <div className='w-1 h-3 bg-violet-400 rounded-full animate-sound-wave' style={{animationDelay: '0.4s'}}></div>
                                </div>
                            )}
                            <p className='text-white text-sm flex-1'>
                                {transcript}
                            </p>
                        </div>
                        {/* Arrow pointing to button */}
                        <div className='absolute -bottom-2 left-8 w-4 h-4 bg-slate-900 border-r border-b border-violet-600 transform rotate-45'></div>
                    </div>
                )}
            </div>

            {/* Add custom animations to your CSS */}
            <style jsx>{`
                @keyframes sound-wave {
                    0%, 100% { height: 0.75rem; }
                    50% { height: 1.25rem; }
                }
                . animate-sound-wave {
                    animation: sound-wave 0.6s ease-in-out infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform:  translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default Ai;