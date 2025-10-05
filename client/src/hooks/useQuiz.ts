import { useEffect, useState } from "react";
import { api } from "../shared/services/api";
import { Quiz } from "../shared/types/quiz";

type QuizState = "started" | "ended" | "pending" ;

const useQuiz = (id: string) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<QuizState>("pending");
    const [timeLeft, setTimeLeft] = useState(5 * 60);

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/notes/${id}/quiz`);
                const data = await response.data;
                setQuiz(data);
            } catch (error) {
                console.error(error);
            } finally { 
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    function startQuiz() {
        setState("started");
        const duration = 5 * 60; // 5 minutes in seconds
        setTimeLeft(duration);
      
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setState("ended");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      
        // Optionally store timer ref for cleanup
        return () => clearInterval(timer);
      }
      

    // function endQuiz() {
    //     setLoading(false);
    //     setError(null);
    // }
    
}

export default useQuiz
