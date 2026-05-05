import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, XCircle, Clock, Bell, Flame, AlertCircle, Coins, HelpCircle, Lock } from "lucide-react";
import { isAlarmSetup } from "../utils/alarmSetup";
import { getIncomingRequestCount } from "../utils/pendingRequests";

export default function Alarm() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"ready" | "playing" | "success" | "failed" | "timeout">("ready");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [questions, setQuestions] = useState<Array<{ question: string; answer: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [alarmSetupComplete, setAlarmSetupComplete] = useState(isAlarmSetup());
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    generateQuestions();
    setNotificationCount(getIncomingRequestCount());

    // Listen for alarm setup completion
    const handleAlarmSetup = () => {
      setAlarmSetupComplete(true);
    };

    // Listen for incoming requests
    const handleIncomingRequest = () => {
      setNotificationCount(getIncomingRequestCount());
    };

    window.addEventListener('alarm-setup-completed', handleAlarmSetup);
    window.addEventListener('incoming-buddy-request', handleIncomingRequest);
    return () => {
      window.removeEventListener('alarm-setup-completed', handleAlarmSetup);
      window.removeEventListener('incoming-buddy-request', handleIncomingRequest);
    };
  }, []);

  useEffect(() => {
    if (timerStarted && timeLeft > 0 && gameState === "playing") {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("timeout");
      setTimeout(() => {
        navigate('/buddy', { state: { failed: true, reason: 'timeout' } });
      }, 2000);
    }
  }, [timerStarted, timeLeft, gameState, navigate]);

  const generateQuestions = () => {
    const newQuestions = [];
    for (let i = 0; i < 3; i++) {
      const num1 = Math.floor(Math.random() * 20) + 1;
      const num2 = Math.floor(Math.random() * 20) + 1;
      const operator = Math.random() > 0.5 ? '+' : '-';

      if (operator === '+') {
        newQuestions.push({
          question: `${num1} + ${num2}`,
          answer: num1 + num2
        });
      } else {
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        newQuestions.push({
          question: `${larger} − ${smaller}`,
          answer: larger - smaller
        });
      }
    }
    setQuestions(newQuestions);
  };

  const handleStart = () => {
    setGameState("playing");
    setTimerStarted(true);
  };

  const handleSubmitAnswer = () => {
    const isCorrect = parseInt(userAnswer) === questions[currentQuestion].answer;

    if (isCorrect) {
      const newCorrect = correctAnswers + 1;
      setCorrectAnswers(newCorrect);

      if (currentQuestion < 2) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer("");
      } else {
        setGameState("success");
        setTimerStarted(false);
        setTimeout(() => {
          navigate('/buddy', { state: { success: true } });
        }, 2000);
      }
    } else {
      setGameState("failed");
      setTimerStarted(false);
    }
  };

  return (
    <div className="bg-[#834dfb] relative size-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-none h-[80px] flex items-center justify-between px-6 border-b border-white/20">
        <div className="w-10" />
        <div className="flex flex-col font-['ABeeZee:Regular',sans-serif] items-center">
          <p className="text-[20px] text-white">
            <span className="font-['Miniver:Regular',sans-serif]">N</span>
            <span className="font-['Michroma:Regular',sans-serif]">ooze</span>
          </p>
        </div>
        <button
          onClick={() => setShowHelp(true)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <HelpCircle className="w-6 h-6 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-[90px]">
        <div className="w-full max-w-[400px] mx-auto">

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[42px] text-[#f0e100] mb-1 leading-tight">
              PROVE
            </h1>
            <p className="font-['Manrope:Bold',sans-serif] font-bold text-[18px] text-white">
              you're awake
            </p>
          </div>

          {/* Game Card */}
          <div className="bg-[#180f2a] rounded-[24px] p-6 shadow-2xl border-2 border-[#f0e100]">
            {!alarmSetupComplete ? (
              <div className="text-center py-8">
                <div className="w-24 h-24 rounded-full bg-[#f0e100]/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-12 h-12 text-[#f0e100]" strokeWidth={2} />
                </div>
                <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-white mb-2">
                  Mini Game Locked
                </h2>
                <p className="text-[14px] text-white/70 font-['Manrope:Regular',sans-serif] mb-6 max-w-[280px] mx-auto">
                  Please complete your alarm setup first to unlock the wake-up challenge
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="w-full bg-[#f0e100] text-[#180f2a] py-4 rounded-[16px] font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[16px] active:scale-[0.98] transition-transform"
                >
                  Go to Alarm Setup
                </button>
              </div>
            ) : gameState === "ready" ? (
              <div className="text-center py-4">
                <AlertCircle className="w-20 h-20 text-[#f0e100] mx-auto mb-4" strokeWidth={2} />
                <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-white mb-2">
                  Wake Up Challenge
                </h2>
                <p className="text-[14px] text-white/70 font-['Manrope:Regular',sans-serif] mb-2">
                  Solve 3 math questions within 30 seconds
                </p>

                <div className="bg-[#f0e100]/10 border border-[#f0e100]/30 rounded-[12px] p-3 mb-6 text-left">
                  <p className="text-[12px] text-white/80 font-['Manrope:Regular',sans-serif] mb-1">
                    <span className="font-['Manrope:SemiBold',sans-serif] text-[#f0e100]">📋 Quick Guide:</span>
                  </p>
                  <ul className="text-[11px] text-white/70 font-['Manrope:Regular',sans-serif] space-y-1 ml-4">
                    <li>• Answer all 3 questions correctly</li>
                    <li>• Complete before the timer runs out</li>
                    <li>• Type your answer and tap Submit</li>
                  </ul>
                  <p className="text-[11px] text-[#f0e100] font-['Manrope:SemiBold',sans-serif] mt-2">
                    Tap (?) button for detailed help
                  </p>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full bg-[#f0e100] text-[#180f2a] py-4 rounded-[16px] font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[16px] active:scale-[0.98] transition-transform"
                >
                  Start Challenge
                </button>
              </div>
            ) : null}

            {alarmSetupComplete && gameState === "playing" && questions.length > 0 && (
              <>
                {/* Timer */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Manrope:SemiBold',sans-serif] text-[13px] text-white/70">
                      Time Left
                    </span>
                    <div className={`font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[24px] ${
                      timeLeft <= 10 ? "text-[#ef4444]" : "text-[#f0e100]"
                    }`}>
                      {timeLeft}s
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        timeLeft <= 10 ? "bg-[#ef4444]" : "bg-[#f0e100]"
                      }`}
                      style={{ width: `${(timeLeft / 30) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Progress Dots */}
                <div className="flex gap-2 mb-6 justify-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-2 w-10 rounded-full transition-all ${
                        i < correctAnswers
                          ? "bg-[#10b981]"
                          : i === currentQuestion
                          ? "bg-[#f0e100]"
                          : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[13px] text-white/70 mb-4">
                    Question {currentQuestion + 1} of 3
                  </p>

                  <h2 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[52px] text-[#f0e100] mb-4 leading-tight">
                    {questions[currentQuestion].question}
                  </h2>

                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="?"
                    className="w-full text-center text-[40px] font-['Manrope:Bold',sans-serif] font-bold bg-white/10 border-2 border-[#f0e100] rounded-[16px] py-3 focus:outline-none focus:border-[#f0e100] mb-4 text-white placeholder:text-white/30"
                    autoFocus
                  />

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer}
                    className="w-full bg-[#f0e100] text-[#180f2a] py-3 rounded-[14px] font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[16px] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {alarmSetupComplete && gameState === "success" && (
              <div className="text-center py-4">
                <CheckCircle2 className="w-20 h-20 text-[#10b981] mx-auto mb-3" strokeWidth={2} />
                <h2 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[24px] text-white mb-2">
                  You're Awake!
                </h2>
                <p className="text-[14px] text-white/70 font-['Manrope:Regular',sans-serif] mb-4">
                  Great job starting your day
                </p>

                <div className="bg-[#10b981]/20 border border-[#10b981] rounded-[14px] p-3 flex items-center justify-center gap-2">
                  <Bell className="w-4 h-4 text-[#10b981]" strokeWidth={2} />
                  <p className="text-[13px] text-[#10b981] font-['Manrope:SemiBold',sans-serif]">
                    Buddies notified
                  </p>
                </div>
              </div>
            )}

            {alarmSetupComplete && gameState === "timeout" && (
              <div className="text-center py-4">
                <XCircle className="w-20 h-20 text-[#ef4444] mx-auto mb-3" strokeWidth={2} />
                <h2 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[24px] text-white mb-2">
                  Time's Up!
                </h2>
                <p className="text-[14px] text-white/70 font-['Manrope:Regular',sans-serif] mb-4">
                  You took too long to wake up
                </p>

                <div className="space-y-2">
                  <div className="bg-[#ef4444]/20 border border-[#ef4444] rounded-[14px] p-3">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <Coins className="w-4 h-4 text-[#ef4444]" strokeWidth={2} />
                      <p className="text-[13px] text-[#ef4444] font-['Manrope:Bold',sans-serif]">
                        -15 points
                      </p>
                    </div>
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <Flame className="w-4 h-4 text-[#ef4444]" strokeWidth={2} />
                      <p className="text-[13px] text-[#ef4444] font-['Manrope:Bold',sans-serif]">
                        Streak reset
                      </p>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Bell className="w-4 h-4 text-[#ef4444]" strokeWidth={2} />
                      <p className="text-[13px] text-[#ef4444] font-['Manrope:Bold',sans-serif]">
                        Buddies notified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {alarmSetupComplete && gameState === "failed" && (
              <div className="text-center py-4">
                <XCircle className="w-20 h-20 text-[#ef4444] mx-auto mb-3" strokeWidth={2} />
                <h2 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[24px] text-white mb-2">
                  Incorrect
                </h2>
                <p className="text-[14px] text-white/70 font-['Manrope:Regular',sans-serif] mb-4">
                  Try again before time runs out
                </p>

                <button
                  onClick={() => {
                    setGameState("playing");
                    setCurrentQuestion(0);
                    setCorrectAnswers(0);
                    setUserAnswer("");
                    setTimeLeft(30);
                    setTimerStarted(true);
                    generateQuestions();
                  }}
                  className="w-full bg-[#f0e100] text-[#180f2a] py-3 rounded-[14px] font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[16px] active:scale-[0.98] transition-transform"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="flex-none h-[90px] bg-[#180f2a] border-t-2 border-[#f0e100] px-6">
        <div className="max-w-[400px] mx-auto h-full flex items-center justify-around">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            </div>
          </button>
          <button onClick={() => navigate('/notifications')} className="flex flex-col items-center gap-1 min-w-[60px] relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            </div>
            {notificationCount > 0 && (
              <div className="absolute top-0 right-3 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-[#180f2a]">
                <span className="text-white font-['Manrope:Bold',sans-serif] text-[10px]">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              </div>
            )}
          </button>
          <button onClick={() => navigate('/buddy')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            </div>
          </button>
          <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </button>
          <button onClick={() => navigate('/account')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-white/40" />
            </div>
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6" onClick={() => setShowHelp(false)}>
          <div
            className="bg-[#180f2a] rounded-[24px] w-full max-w-[400px] p-6 border-2 border-[#f0e100] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#f0e100]">
                How to Play
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <XCircle className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-4 text-white">
              <div>
                <h3 className="font-['Manrope:SemiBold',sans-serif] text-[15px] text-[#f0e100] mb-2">
                  🎯 Goal
                </h3>
                <p className="text-[13px] font-['Manrope:Regular',sans-serif] text-white/80">
                  Prove you're awake by solving 3 simple math problems before the timer runs out!
                </p>
              </div>

              <div>
                <h3 className="font-['Manrope:SemiBold',sans-serif] text-[15px] text-[#f0e100] mb-2">
                  ⏱️ Rules
                </h3>
                <ul className="text-[13px] font-['Manrope:Regular',sans-serif] text-white/80 space-y-1 ml-4">
                  <li>• You have 30 seconds total</li>
                  <li>• Must answer all 3 questions correctly</li>
                  <li>• One wrong answer = restart</li>
                  <li>• Simple addition & subtraction only</li>
                </ul>
              </div>

              <div>
                <h3 className="font-['Manrope:SemiBold',sans-serif] text-[15px] text-[#f0e100] mb-2">
                  🎮 How to Play
                </h3>
                <ol className="text-[13px] font-['Manrope:Regular',sans-serif] text-white/80 space-y-1 ml-4">
                  <li>1. Tap "Start Challenge"</li>
                  <li>2. Read the math question</li>
                  <li>3. Type your answer in the box</li>
                  <li>4. Tap "Submit" to check</li>
                  <li>5. Continue to the next question</li>
                </ol>
              </div>

              <div>
                <h3 className="font-['Manrope:SemiBold',sans-serif] text-[15px] text-[#f0e100] mb-2">
                  ✨ Tips
                </h3>
                <ul className="text-[13px] font-['Manrope:Regular',sans-serif] text-white/80 space-y-1 ml-4">
                  <li>• Focus on accuracy over speed</li>
                  <li>• Watch the timer at the top</li>
                  <li>• Green dots = completed questions</li>
                  <li>• Yellow dot = current question</li>
                </ul>
              </div>

              <div className="bg-[#f0e100]/10 border border-[#f0e100]/30 rounded-[12px] p-3">
                <p className="text-[12px] font-['Manrope:SemiBold',sans-serif] text-[#f0e100] text-center">
                  💪 You got this! Wake up and conquer the day!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full bg-[#f0e100] text-[#180f2a] py-3 rounded-[14px] font-['Manrope:Bold',sans-serif] text-[16px] mt-4 active:scale-[0.98] transition-transform"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
