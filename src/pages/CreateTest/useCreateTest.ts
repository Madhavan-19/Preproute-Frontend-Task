import { useState, useEffect } from "react";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import type { TestFormData, Question } from "./Create.types";
import { getSubjectsApi,getTopicsApi,getSubTopicsApi,createTestApi, updateTestApi} from "../../api/testApi";

export const useCreateTest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [testType, setTestType] = useState("chapterwise");
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<TestFormData>({ testType: "chapterwise" });
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [subTopics, setSubTopics] = useState<any[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [subTopicsLoading, setSubTopicsLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { savedFormData, savedQuestions, isEditing, testId: existingTestId } = location.state as any;
      if (savedFormData) {
        setFormData(savedFormData);
        setTestType(savedFormData.testType || "chapterwise");
      }
      if (savedQuestions?.length) {
        setQuestions(savedQuestions);
        setStep(2);
      }
      if (isEditing) {
        setIsEditMode(true);
        if (existingTestId) setTestId(existingTestId);
      }
    }
  }, [location.state]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const res = await getSubjectsApi();
      if (res.data.status === "success") setSubjects(res.data.data);
    } catch {
      message.error("Failed to load subjects");
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.subject) fetchTopics(formData.subject);
  }, [formData.subject]);

  const fetchTopics = async (subjectId: string) => {
    try {
      setTopicsLoading(true);
      const res = await getTopicsApi(subjectId);
      if (res.data.status === "success") setTopics(res.data.data);
    } catch {
      message.error("Failed to load topics");
    } finally {
      setTopicsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.topic) fetchSubTopics(formData.topic);
  }, [formData.topic]);

  const fetchSubTopics = async (topicId: string) => {
    try {
      setSubTopicsLoading(true);
      const res = await getSubTopicsApi(topicId);
      if (res.data.status === "success") setSubTopics(res.data.data);
    } catch {
      message.error("Failed to load sub topics");
    } finally {
      setSubTopicsLoading(false);
    }
  };

  const handleFormFieldChange = (field: keyof TestFormData, value: any) => {
    if (field === "subject") {
      setTopics([]);
      setSubTopics([]);
      setFormData(prev => ({ ...prev, subject: value, topic: "", subTopic: "" }));
      return;
    }
    if (field === "topic") {
      setSubTopics([]);
      setFormData(prev => ({ ...prev, topic: value, subTopic: "" }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionsChange = (updatedQuestions: Question[]) => {
    setQuestions(updatedQuestions);
    if (updatedQuestions.length && !selectedQuestionId) {
      setSelectedQuestionId(String(updatedQuestions[0].id));
    }
  };

  const validateStep1 = (): boolean => {
    if (!formData.testName) { message.error("Please enter test name"); return false; }
    if (!formData.subject) { message.error("Please select subject"); return false; }
    if (!formData.duration) { message.error("Please enter duration"); return false; }
    if (testType === "chapterwise" && !formData.topic) { message.error("Please select topic"); return false; }
    if (testType === "pyq" && !formData.exam) { message.error("Please select exam"); return false; }
    if (testType === "pyq" && !formData.year) { message.error("Please select year"); return false; }
    if (testType === "mock" && !formData.questionsCount) { message.error("Please enter questions count"); return false; }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep1()) return;
    setLoading(true);

    if (isEditMode && testId) {
      const payload = {
        name: formData.testName,
        type: testType,
        subject: formData.subject, 
        topics: formData.topic ? [formData.topic] : [],
        sub_topics: formData.subTopic ? [formData.subTopic] : [],
        total_time: formData.duration || 0,
        difficulty: formData.difficultyLevel || "easy",
        correct_marks: formData.correctAnswerMarks || 0,
        wrong_marks: formData.wrongAnswerMarks || 0,
        unattempt_marks: formData.unattemptedMarks || 0,
        total_marks: formData.totalMarks || 0,
        total_questions: formData.noOfQuestions || 0,
        status: "draft",
      };
      try {
        const response = await updateTestApi(testId, payload);
        if (response.data.success || response.data.status === "success") {
          message.success("Test details saved!");
          setStep(2);
        }
      } catch {
        message.error("Test update failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    const payload = {
      name: formData.testName,
      type: testType,
      subject: formData.subject,
      topics: formData.topic ? [formData.topic] : [],
      sub_topics: formData.subTopic ? [formData.subTopic] : [],
      correct_marks: formData.correctAnswerMarks || 0,
      wrong_marks: formData.wrongAnswerMarks || 0,
      unattempt_marks: formData.unattemptedMarks || 0,
      difficulty: formData.difficultyLevel || "easy",
      total_time: formData.duration || 0,
      total_marks: formData.totalMarks || 0,
      total_questions: formData.noOfQuestions || 0,
      status: "draft",
    };

    try {
      const res = await createTestApi(payload);
      if (res.data.status === "success") {
        setTestId(res.data.data.id);
        message.success("Test created");
        setStep(2);
      }
    } catch {
      message.error("Test creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (finalQuestions: Question[]) => {
    if (isEditMode && testId) {
      await handleUpdateTest(finalQuestions);
      return;
    }
    
    setLoading(true);
    const payload = {
      name: formData.testName,
      type: testType,
      subject: formData.subject,
      topics: formData.topic ? [formData.topic] : [],
      sub_topics: formData.subTopic ? [formData.subTopic] : [],
      correct_marks: formData.correctAnswerMarks || 0,
      wrong_marks: formData.wrongAnswerMarks || 0,
      unattempt_marks: formData.unattemptedMarks || 0,
      difficulty: formData.difficultyLevel || "easy",
      total_time: formData.duration || 0,
      total_marks: (formData.correctAnswerMarks || 0) * finalQuestions.length,
      total_questions: finalQuestions.length,
      questions: finalQuestions,
      status: "published",
    };

    try {
      const response = await createTestApi(payload);
      if (response.data.success || response.data.status === "success") {
        message.success(`Test Published!`);
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch {
      message.error("Failed to publish test");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTest = async (finalQuestions: Question[]) => {
    setLoading(true);
    const payload = {
      name: formData.testName,
      type: testType,  
      subject: formData.subject, 
      topics: formData.topic ? [formData.topic] : [],
      sub_topics: formData.subTopic ? [formData.subTopic] : [],
      total_time: formData.duration || 0,
      difficulty: formData.difficultyLevel || "easy",
      correct_marks: formData.correctAnswerMarks || 0,
      wrong_marks: formData.wrongAnswerMarks || 0,
      unattempt_marks: formData.unattemptedMarks || 0,
      total_questions: finalQuestions.length,
      total_marks: (formData.correctAnswerMarks || 0) * finalQuestions.length,
      questions: finalQuestions, 
      status: "published"
    };

    try {
      const response = await updateTestApi(testId, payload);
      if (response.data.success || response.data.status === "success") {
        message.success(`Test Updated!`);
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch {
      message.error("Failed to update test");
    } finally {
      setLoading(false);
    }
  };

  return {
    testType, setTestType,
    step, setStep,
    questions,
    selectedQuestionId, setSelectedQuestionId,
    isEditMode, setIsEditMode,
    formData,
    loading,
     testId, 
    subjects, topics, subTopics,
    subjectsLoading, topicsLoading, subTopicsLoading,
    handleFormFieldChange,
    handleQuestionsChange,
    handleNext,
    handlePublish,
  };
};