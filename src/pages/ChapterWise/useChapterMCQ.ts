// useChapterWiseMCQ.ts
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import { useLocation ,useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { createBulkQuestionsApi, publishTestApi } from "../../api/testApi";
import type { Question, TestFormData } from "../CreateTest/Create.types";
import type { PublishState } from "./ChapterWiseMCQ.types";

export const useChapterWiseMCQ = (
  propTestFormData?: TestFormData,
  testId?: string,
  onQuestionsChange?: (questions: Question[]) => void,
  _onPublish?: (questions: Question[]) => void,
  selectedQuestionId?: string
) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // States
  const [testFormData, setTestFormData] = useState(propTestFormData);
  const [isPublishing, setIsPublishing] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now(),
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      solution: "",
      difficulty: "",
      topic: propTestFormData?.topic || "",
      subTopic: propTestFormData?.subTopic || "",
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(20);
  const [showPublishScreen, setShowPublishScreen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>({
    publishType: 'now',
    scheduleDate: '',
    scheduleTime: '',
    liveUntil: 'always',
    customEndDate: '',
    customEndTime: '',
    startDate: '',
    startTime: '',
  });

  // Set max questions from form data
  useEffect(() => {
    if (propTestFormData?.questionsCount) {
      setMaxQuestions(propTestFormData.questionsCount);
    } else if (propTestFormData?.noOfQuestions) {
      const noOfQuestions = typeof propTestFormData.noOfQuestions === 'number' 
        ? propTestFormData.noOfQuestions 
        : parseInt(propTestFormData.noOfQuestions as string);
      if (!isNaN(noOfQuestions)) {
        setMaxQuestions(noOfQuestions);
      }
    }
  }, [propTestFormData]);

  // Handle edit data from location state
  useEffect(() => {
    if (location.state) {
      const { updatedFormData, existingQuestions, fromEdit } = location.state as any;
      
      if (fromEdit && updatedFormData) {
        setTestFormData(updatedFormData);
        message.success("Test details updated successfully!");
        
        if (updatedFormData.questionsCount) {
          setMaxQuestions(updatedFormData.questionsCount);
        } else if (updatedFormData.noOfQuestions) {
          const noOfQuestions = typeof updatedFormData.noOfQuestions === 'number' 
            ? updatedFormData.noOfQuestions 
            : parseInt(updatedFormData.noOfQuestions as string);
          if (!isNaN(noOfQuestions)) {
            setMaxQuestions(noOfQuestions);
          }
        }
        
        if (existingQuestions && existingQuestions.length > 0) {
          const updatedQuestions = existingQuestions.map((q: Question) => ({
            ...q,
            topic: updatedFormData.topic || q.topic,
            subTopic: updatedFormData.subTopic || q.subTopic,
          }));
          setQuestions(updatedQuestions);
          onQuestionsChange?.(updatedQuestions);
        }
        
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, onQuestionsChange]);

  // Auto-populate topic and subtopic
  useEffect(() => {
    if (testFormData) {
      setQuestions((prev) =>
        prev.map((q) => ({
          ...q,
          topic: testFormData.topic || q.topic,
          subTopic: testFormData.subTopic || q.subTopic,
        }))
      );
    }
  }, [testFormData]);

  // Sync selected question from sidebar
  useEffect(() => {
    if (selectedQuestionId) {
      const index = questions.findIndex((q) => q.id === Number(selectedQuestionId));
      if (index !== -1 && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }, [selectedQuestionId, questions, currentIndex]);

  // Fetch test data
  useEffect(() => {
    const fetchTestData = async () => {
      if (testId) {
        setPageLoading(true);
        try {
          const response = await axiosInstance.get(`/tests/${testId}`);
          if (response.data && response.data.status === "success") {
            const testData = response.data.data;
            const fetchedFormData: TestFormData = {
              testName: testData.name || "",
              subject: testData.subject || "",
              topic: testData.topics?.[0] || "",
              subTopic: testData.sub_topics?.[0] || "",
              difficultyLevel: testData.difficulty || "easy",
              duration: testData.total_time || 0,
              totalMarks: testData.total_marks || 0,
              questionsCount: testData.total_questions || 0,
              noOfQuestions: testData.total_questions || 0,
            };
            setTestFormData(fetchedFormData);
            if (testData.total_questions) {
              setMaxQuestions(testData.total_questions);
            }
            message.success("Test data loaded successfully!");
          }
        } catch (error) {
          console.error('Failed to fetch test data:', error);
          message.error('Failed to load test data');
        } finally {
          setPageLoading(false);
        }
      }
    };
    fetchTestData();
  }, [testId]);

  // Send questions to parent
  useEffect(() => {
    onQuestionsChange?.(questions);
  }, [questions, onQuestionsChange]);

  // Handlers
  const currentQuestion = questions[currentIndex];
  const remainingQuestions = maxQuestions - questions.length;

  const updateQuestion = (field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[currentIndex] = {
      ...updated[currentIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  const updateOption = (optionIndex: number, value: string) => {
    const updated = [...questions];
    const updatedOptions = [...updated[currentIndex].options];
    updatedOptions[optionIndex] = value;
    updated[currentIndex] = {
      ...updated[currentIndex],
      options: updatedOptions,
    };
    setQuestions(updated);
  };

  const addQuestion = () => {
    if (questions.length >= maxQuestions) {
      Modal.warning({
        title: "Maximum Questions Reached",
        content: `You can only add up to ${maxQuestions} questions for this test.`,
        okText: "OK",
      });
      return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      solution: "",
      difficulty: "",
      topic: testFormData?.topic || "",
      subTopic: testFormData?.subTopic || "",
    };

    const updated = [...questions, newQuestion];
    setQuestions(updated);
    setCurrentIndex(updated.length - 1);
    message.success(`Question ${updated.length} added. ${maxQuestions - updated.length} remaining.`);
  };

  const clearQuestion = () => {
    Modal.confirm({
      title: "Clear Question?",
      content: "This will clear all data for this question",
      okText: "Clear",
      onOk: () => {
        const updated = [...questions];
        updated[currentIndex] = {
          ...updated[currentIndex],
          text: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          solution: "",
        };
        setQuestions(updated);
        message.success("Question Cleared");
      },
    });
  };

  const saveQuestion = () => {
    if (!currentQuestion.text.trim()) {
      message.error("Please enter the question");
      return;
    }
    if (currentQuestion.options.some((option) => !option.trim())) {
      message.error("Please fill all options");
      return;
    }
    if (!currentQuestion.correctAnswer) {
      message.error("Please select the correct answer");
      return;
    }
    message.success("Question Saved Successfully!");
  };

  const validateAllQuestions = (): boolean => {
    if (questions.length < maxQuestions) {
      message.warning(`Please add ${remainingQuestions} more question(s) to reach ${maxQuestions} questions.`);
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        message.error(`Question ${i + 1} has no text`);
        setCurrentIndex(i);
        return false;
      }
      if (q.options.some((opt) => !opt.trim())) {
        message.error(`Question ${i + 1} has empty options`);
        setCurrentIndex(i);
        return false;
      }
      if (!q.correctAnswer) {
        message.error(`Question ${i + 1} has no correct answer selected`);
        setCurrentIndex(i);
        return false;
      }
    }
    return true;
  };

  const publishTest = () => {
    if (!validateAllQuestions()) {
      return;
    }
    setShowPublishScreen(true);
  };

 const handleConfirmPublish = async () => {
  //  Prevent duplicate publishing
  if (isPublishing) {
    message.warning('Test is already being published...');
    return;
  }

  // Validation
  if (publishState.publishType === 'now') {
    if (!publishState.startDate || !publishState.startTime) {
      message.error('Please select both start date and time');
      return;
    }
  }
  
  if (publishState.publishType === 'schedule') {
    if (!publishState.scheduleDate || !publishState.scheduleTime) {
      message.error('Please select both date and time for scheduled publish');
      return;
    }
  }
  
  if (publishState.liveUntil === 'custom') {
    if (!publishState.customEndDate || !publishState.customEndTime) {
      message.error('Please select end date and time for custom duration');
      return;
    }
  }

  setIsPublishing(true);  // Set to true
  setPageLoading(true);
  
  try {
    const questionsPayload = questions.map(q => {
      const correctOptionIndex = q.options.findIndex(opt => opt === q.correctAnswer);
      const correctOption = `option${correctOptionIndex + 1}`;
      
      return {
        type: "mcq",
        question: q.text,
        option1: q.options[0] || "",
        option2: q.options[1] || "",
        option3: q.options[2] || "",
        option4: q.options[3] || "",
        correct_option: correctOption,
        difficulty: q.difficulty || 'easy',
        topic: q.topic || testFormData?.topic || "",
        sub_topic: q.subTopic || testFormData?.subTopic || "",
        subject: testFormData?.subject || "",
      };
    });

    const bulkResponse = await createBulkQuestionsApi(questionsPayload);
    
    if (bulkResponse.data.status === "success") {
      
      
      const publishPayload = {
        status: "live",
        publish_type: publishState.publishType,
        ...(publishState.publishType === 'now' && {
          start_date: publishState.startDate,
          start_time: publishState.startTime
        }),
        ...(publishState.publishType === 'schedule' && {
          scheduled_date: publishState.scheduleDate,
          scheduled_time: publishState.scheduleTime
        }),
        live_until: publishState.liveUntil,
        ...(publishState.liveUntil === 'custom' && {
          end_date: publishState.customEndDate,
          end_time: publishState.customEndTime
        }),
        // REMOVE question_ids - don't send this
        // question_ids: questionIds,
        total_questions: questions.length,
        total_marks: (testFormData?.correctAnswerMarks || 4) * questions.length
      };
      
      if (testId) {
        await publishTestApi(testId, publishPayload);
        message.success("🎉 Test Published Successfully!");
        // onPublish?.(questions);
        
        //  Close publish screen after success
        setTimeout(() => {
          setShowPublishScreen(false);
          setIsPublishing(false);
          navigate('/dashboard');
        }, 1500);
        
      } else {
        message.error("Test ID not found");
        setIsPublishing(false);
      }
    } else {
      message.error(bulkResponse.data.message || "Failed to create questions");
      setIsPublishing(false);
    }
  } catch (error: any) {
    console.error('Publish failed:', error);
    
    //  Better error handling
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      errors.forEach((err: any) => {
        message.error(`${err.path}: ${err.msg}`);
      });
    } else {
      message.error("Failed to publish test");
    }
    
    setIsPublishing(false);
  } finally {
    setPageLoading(false);
  }
};

  const handleExportCSV = () => {
    const csvData = questions.map((q, idx) => ({
      "S.No": idx + 1,
      "Question": q.text,
      "Option 1": q.options[0],
      "Option 2": q.options[1],
      "Option 3": q.options[2],
      "Option 4": q.options[3],
      "Correct Answer": q.correctAnswer,
      "Solution": q.solution,
      "Difficulty": q.difficulty,
      "Topic": q.topic,
      "Sub Topic": q.subTopic,
    }));

    const headers = Object.keys(csvData[0]);
    const csvRows = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => 
          JSON.stringify(row[header as keyof typeof row] || '')
        ).join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${testFormData?.testName || 'test'}_questions.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    message.success('CSV exported successfully!');
  };

  return {
    // State
    testFormData,
    questions,
    currentIndex,
    maxQuestions,
    showPublishScreen,
    pageLoading,
    publishState,
    currentQuestion,
    remainingQuestions,
    isPublishing,
    
    // Setters
    setTestFormData,
    setQuestions,
    setCurrentIndex,
    setShowPublishScreen,
    setPublishState,
    setIsPublishing,
    
    // Handlers
    updateQuestion,
    updateOption,
    addQuestion,
    clearQuestion,
    saveQuestion,
    validateAllQuestions,
    publishTest,
    handleConfirmPublish,
    handleExportCSV,
  };
};