import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Radio,
  Tag,
  Button,
  Input,
  Select,
  Space,
  message,
  Modal,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  EditOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "./ChapterWiseMCQ.css";
import type { TestFormData, Question } from "../CreateTest/Create.types";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Props {
  onBack: () => void;
  onQuestionsChange?: (questions: Question[]) => void;
  selectedQuestionId?: string;
  onPublish?: (questions: Question[]) => void;
  testFormData?: TestFormData;
  onEditTestDetails?: () => void;
  loading?: boolean;
}

export default function ChapterWiseMCQ({
  onBack,
  onQuestionsChange,
  selectedQuestionId,
  onPublish,
  testFormData: propTestFormData,
  onEditTestDetails,
}: Props) {
  const location = useLocation();
  const [testFormData, setTestFormData] = useState(propTestFormData);
  const [showPublishScreen, setShowPublishScreen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
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

  // Get max questions from testFormData
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

  // Check for updated data coming from edit
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

  // Auto-populate topic and subtopic from form data
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

  // Sidebar question click sync
  useEffect(() => {
    if (selectedQuestionId) {
      const index = questions.findIndex((q) => q.id === Number(selectedQuestionId));
      if (index !== -1 && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }, [selectedQuestionId, questions, currentIndex]);

  // Send data to parent
  useEffect(() => {
    onQuestionsChange?.(questions);
  }, [questions, onQuestionsChange]);

  const currentQuestion = questions[currentIndex];
  const remainingQuestions = maxQuestions - questions.length;

  // Update question
  const updateQuestion = (field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[currentIndex] = {
      ...updated[currentIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  // Update option
  const updateOption = (optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[currentIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  // Add question - Check limit
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

  // Delete question
  const deleteQuestion = () => {
    if (questions.length === 1) {
      message.warning("Minimum one question required");
      return;
    }

    Modal.confirm({
      title: "Delete Question?",
      content: "This action cannot be undone",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        const updated = questions.filter((_, index) => index !== currentIndex);
        setQuestions(updated);
        if (currentIndex >= updated.length) {
          setCurrentIndex(updated.length - 1);
        } else {
          setCurrentIndex(currentIndex);
        }
        message.success("Question Deleted");
      },
    });
  };

  // Clear current question
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

  // Save question
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

  // Validate all questions
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

  // Publish test
  const publishTest = () => {
    if (!validateAllQuestions()) {
      return;
    }
     setShowPublishScreen(true);
  };

  // Handle CSV export
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

  const [publishType, setPublishType] = useState<'now' | 'schedule'>('now');
const [scheduleDate, setScheduleDate] = useState('');
const [scheduleTime, setScheduleTime] = useState('');
const [liveUntil, setLiveUntil] = useState('always');
const [customEndDate, setCustomEndDate] = useState('');
const [customEndTime, setCustomEndTime] = useState('');
const [startDate, setStartDate] = useState('');
const [startTime, setStartTime] = useState('');

const handleConfirmPublish = () => {
  if (publishType === 'now') {
    if (!startDate || !startTime) {
      message.error('Please select both start date and time');
      return;
    }
    message.success(`Test published from ${startDate} at ${startTime}`);
  }
  
  if (publishType === 'schedule') {
    if (!scheduleDate || !scheduleTime) {
      message.error('Please select both date and time for scheduled publish');
      return;
    }
    message.success(`Test scheduled for ${scheduleDate} at ${scheduleTime}`);
  }
  
  if (liveUntil === 'custom') {
    if (!customEndDate || !customEndTime) {
      message.error('Please select end date and time for custom duration');
      return;
    }
  }
  
  message.success("Test Published Successfully!");
  onPublish?.(questions);
};
  return (
    <div className="chapter-mcq-page">
      {/* HEADER */}
      <div className="breadcrumb-header">
        <div className="chapter-breadcrumb">
          <span>Test Creation</span>
          <span className="slash">/</span>
          <span>Create Test</span>
          <span className="slash">/</span>
          <span className="active-text">Chapter Wise</span>
        </div>

        <Button type="primary" className="publish-btn" onClick={publishTest}>
          Publish Test
        </Button>
      </div>

      {/* TOP CARD - Displaying Form Data with Edit Button */}
      <Card className="chapter-info-card">
        <div className="chapter-badge">Chapter Wise</div>

        <div className="chapter-top">
          <div style={{ flex: 1 }}>
            <div className="chapter-title-row">
              <Title level={5} style={{ margin: 0 }}>
                📚 {testFormData?.testName || "Untitled Test"}
              </Title>
              <Tag
                color={
                  testFormData?.difficultyLevel === "easy"
                    ? "green"
                    : testFormData?.difficultyLevel === "medium"
                    ? "orange"
                    : "red"
                }
              >
                {testFormData?.difficultyLevel || "Easy"}
              </Tag>
            </div>

            <div className="chapter-meta">
              <div>
                <Text type="secondary">Subject</Text>
                <span>: {testFormData?.subject || "Not Selected"}</span>
              </div>

              <div>
                <Text type="secondary">Topic</Text>
                <div className="tag-row">
                  <Tag color="gold">{testFormData?.topic || "Not Selected"}</Tag>
                </div>
              </div>

              <div>
                <Text type="secondary">Sub Topic</Text>
                <div className="tag-row">
                  <Tag color="gold">{testFormData?.subTopic || "Not Selected"}</Tag>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button Section */}
          <div style={{ textAlign: "right", marginTop: -50 }}>
            <Tooltip title="Edit Test Details">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={onEditTestDetails}
                style={{ color: "#722ed1" }}
              >
                Edit Details
              </Button>
            </Tooltip>

            <div 
              className="exam-details-clickable" 
              style={{ 
                marginTop: 117,
                padding: "7px 11px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: "#fff",
                border: "1px solid #f0f0f0",
                textAlign: "center",
              }}
            >
              <Space size="middle" split={<span style={{ color: "#d9d9d9" }}>|</span>}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <ClockCircleOutlined style={{ color: "#722ed1" }} /> 
                  <strong>{testFormData?.duration || 0}</strong> Min
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <FileTextOutlined style={{ color: "#722ed1" }} /> 
                  <strong>{questions.length}</strong>/{maxQuestions} Q's
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <TrophyOutlined style={{ color: "#722ed1" }} /> 
                  <strong>{testFormData?.totalMarks || 0}</strong> Marks
                </span>
              </Space>
            </div>
          </div>
        </div>
      </Card>

      {/* QUESTION HEADER */}
       {!showPublishScreen ? (
        <>
      <div className="question-header">
        <div>
          <Title level={5} style={{ marginBottom: 4 }}>
            Question {currentIndex + 1} / {questions.length}
          </Title>
         
          {questions.length === maxQuestions && (
            <Text type="success" style={{ fontSize: 12, color: "#52c41a" }}>
              ✓ All {maxQuestions} questions added
            </Text>
          )}
          <Button type="link" danger icon={<DeleteOutlined />} className="delete-btn" onClick={clearQuestion}>
            Clear Question
          </Button>
        </div>

        <Space>
          <Button 
            icon={<PlusOutlined />} 
            onClick={addQuestion}
            disabled={questions.length >= maxQuestions}
          >
            Add MCQ {questions.length >= maxQuestions && `(Max ${maxQuestions})`}
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportCSV}
          >
            CSV
          </Button>
        </Space>
      </div>

      {/* QUESTION EDITOR */}
      <div className="editor-container">
        <div className="toolbar">
          <span>B</span>
          <span>I</span>
          <span>U</span>
          <span>•</span>
          <span>≡</span>
        </div>

        <TextArea
          rows={7}
          placeholder="Type your question here..."
          value={currentQuestion.text}
          onChange={(e) => updateQuestion("text", e.target.value)}
          className="editor-input"
        />
      </div>

      {/* OPTIONS */}
      <div className="options-wrapper">
        <Text className="options-title">Type the options below</Text>

        {currentQuestion.options.map((option, index) => (
          <div className="option-item" key={index}>
            <input
              type="radio"
              name="correctAnswer"
              checked={currentQuestion.correctAnswer === option}
              onChange={() => updateQuestion("correctAnswer", option)}
              disabled={!option.trim()}
            />
            <Input
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
            />
            <DeleteOutlined 
              className="delete-option" 
              onClick={() => updateOption(index, "")}
              style={{ cursor: 'pointer', color: '#ff4d4f' }}
            />
          </div>
        ))}
      </div>

      {/* SOLUTION */}
      <div className="solution-section">
        <Text className="solution-title">Add Solution</Text>
        <TextArea
          rows={5}
          placeholder="Type the solution explanation here..."
          value={currentQuestion.solution}
          onChange={(e) => updateQuestion("solution", e.target.value)}
        />
      </div>

      {/* QUESTION SETTINGS */}
      <div className="settings-section">
        <Title level={5}>Question Settings</Title>

        <div className="settings-grid">
          <div>
            <Text className="label">Difficulty Level</Text>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Select difficulty"
              value={currentQuestion.difficulty || undefined}
              onChange={(value) => updateQuestion("difficulty", value)}
              options={[
                { label: "Easy", value: "easy" },
                { label: "Medium", value: "medium" },
                { label: "Hard", value: "hard" },
              ]}
            />
          </div>

          <div>
            <Text className="label">Topic</Text>
            <Input
              size="large"
              value={currentQuestion.topic}
              onChange={(e) => updateQuestion("topic", e.target.value)}
              placeholder="Enter topic name"
            />
          </div>

          <div>
            <Text className="label">Sub Topic</Text>
            <Input
              size="large"
              value={currentQuestion.subTopic}
              onChange={(e) => updateQuestion("subTopic", e.target.value)}
              placeholder="Enter sub topic name"
            />
          </div>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="footer-buttons">
        <Button danger onClick={onBack}>
          Exit Test Creation
        </Button>

        <Space>
          <Button onClick={deleteQuestion}>Delete Question</Button>
          <Button 
            onClick={addQuestion}
            disabled={questions.length >= maxQuestions}
          >
            Add Question
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={saveQuestion}>
            Save Question
          </Button>
        </Space>
      </div>
      </>
          ) : (
            // Publish screen - idha new ah create pannanum
    
     // Publish screen - Fixed version
<div className="publish-review-page">
  
  {/* Publish Now - Start Date & End Date Section */}


  {/* Segmented Publish Type Buttons */}
  <div className="publish-type-wrapper">
    <button 
      className={`publish-type-btn ${publishType === 'now' ? 'active' : ''}`}
      onClick={() => setPublishType('now')}
    >
      Publish Now
    </button>
    <button 
      className={`publish-type-btn ${publishType === 'schedule' ? 'active' : ''}`}
      onClick={() => setPublishType('schedule')}
    >
      Schedule Publish
    </button>
  </div>

  {/* Schedule Publish Section - Shows only when schedule is selected */}
  {publishType === 'schedule' && (
    <div className="schedule-section">
      <Title level={5}>Select Date and Time</Title>
      <div className="datetime-picker-wrapper">
        <div className="datetime-field">
          
          <Input 
            type="date" 
            className="datetime-input"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        </div>
        <div className="datetime-field">
          <Input 
            type="time" 
            className="datetime-input"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />
        </div>
      </div>
    </div>
  )}

  

  {/* Live Until Section */}
  <div className="live-settings">
    <Title level={5}>Live Until</Title>
    <Text type="secondary" className="live-description">
      Choose how long this test should remain available on the platform.
    </Text>
    
    <Radio.Group 
      value={liveUntil} 
      onChange={(e) => setLiveUntil(e.target.value)}
      className="live-options-group"
    >
      <div className="live-options-grid">
        <Radio value="always">Always Available</Radio>
        <Radio value="1week">1 Week</Radio>
        <Radio value="2weeks">2 Weeks</Radio>
        <Radio value="3weeks">3 Weeks</Radio>
        <Radio value="1month">1 Month</Radio>
        <Radio value="custom">Custom Duration</Radio>
      </div>
    </Radio.Group>

    {/* Custom Duration Date Picker */}
    {liveUntil === 'custom' && (
      <div className="custom-date-wrapper">
        <Text className="field-label">Select End Date</Text>
        <Input 
          type="date" 
          className="end-date-input"
          value={customEndDate}
          onChange={(e) => setCustomEndDate(e.target.value)}
        />
        <Text className="field-label" style={{ marginTop: 12 }}>Select End Time</Text>
        <Input 
          type="time" 
          className="end-time-input"
          value={customEndTime}
          onChange={(e) => setCustomEndTime(e.target.value)}
        />
      </div>
    )}

      {publishType === 'now' && (
    <div className="date-range-section">
      
      <div className="datetime-picker-wrapper">
        <div className="datetime-field">
          <Text className="field-label">Start Date</Text>
          <Input 
            type="date" 
            className="datetime-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="datetime-field">
          <Text className="field-label">Start Time</Text>
          <Input 
            type="time" 
            className="datetime-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>
    </div>
  )}
  {publishType === 'schedule' && (
    <div className="schedule-section">
    
      <div className="datetime-picker-wrapper">
        <div className="datetime-field">
          
          <Input 
            type="date" 
            className="datetime-input"
            placeholder="Select End Date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        </div>
        <div className="datetime-field">
          <Input 
            type="time" 
            className="datetime-input"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />
        </div>
      </div>
    </div>
  )}
  </div>

  {/* Action Buttons */}
  <div className="publish-actions">
    <Button size="large" onClick={() => setShowPublishScreen(false)}>Cancel</Button>
    <Button type="primary" size="large" onClick={handleConfirmPublish}>Confirm</Button>
  </div>
</div>
          )}
      </div>
 
    
  );
}