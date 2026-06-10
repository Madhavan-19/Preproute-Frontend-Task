import { useState, useEffect } from "react";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import type { TestFormData, Question } from "./Create.types";

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

  // Load saved data from location state
  useEffect(() => {
    if (location.state) {
      const { savedFormData, savedQuestions, isEditing } = location.state as any;
      if (savedFormData) {
        setFormData(savedFormData);
        setTestType(savedFormData.testType || "chapterwise");
      }
      if (savedQuestions?.length) {
        setQuestions(savedQuestions);
        setStep(2);
      }
      if (isEditing) setIsEditMode(true);
    }
  }, [location.state]);

  const handleFormFieldChange = (field: keyof TestFormData, value: any) => {
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

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handlePublish = async (finalQuestions: Question[]) => {
    setLoading(true);
    const payload = {
      ...formData,
      testType,
      questions: finalQuestions,
      totalQuestions: finalQuestions.length,
      createdAt: new Date().toISOString(),
    };

    try {
      // Simulate API call - Replace with actual endpoint
      const response = await axiosInstance.post("/tests/create", payload);
      if (response.data.success) {
        message.success(`Test "${formData.testName}" Published Successfully!`);
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Publish error:", error);
      message.error("Failed to publish test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    testType, setTestType,
    step, setStep,
    questions,
    selectedQuestionId, setSelectedQuestionId,
    isEditMode, setIsEditMode,
    formData,
    loading,
    
    // Actions
    handleFormFieldChange,
    handleQuestionsChange,
    handleNext,
    handlePublish,
  };
};