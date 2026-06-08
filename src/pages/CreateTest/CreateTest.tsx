import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Segmented,
  Radio,
  InputNumber,
  Typography,
  Divider,
  Space,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import Dashboardlayout from "../../components/DashboardLayout/Dashboardlayout";
import "./CreateTest.css";
import ChapterWiseMCQ from "../ChapterWise/ChapterWiseMCQ";
import { CheckOutlined, DoubleRightOutlined } from "@ant-design/icons";

const { Title} = Typography;

export interface TestFormData {
  testType: string;
  subject?: string;
  testName?: string;
  topic?: string;
  subTopic?: string;
  exam?: string;
  year?: string;
  questionsCount?: number;
  duration?: number;
  difficultyLevel?: string;
  wrongAnswerMarks?: number;
  unattemptedMarks?: number;
  correctAnswerMarks?: number;
  noOfQuestions?: number;
  totalMarks?: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  solution: string;
  difficulty: string;
  topic: string;
  subTopic: string;
}

export default function CreateTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const [testType, setTestType] = useState("chapterwise");
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [backupFormData, setBackupFormData] = useState<TestFormData | null>(null);

  const [formData, setFormData] = useState<TestFormData>({
    testType: "chapterwise",
  });

  // Load saved data from location state
  useEffect(() => {
    if (location.state) {
      const { savedFormData, savedQuestions, isEditing, fromEdit } = location.state as any;

      if (savedFormData) {
        setFormData(savedFormData);
        setTestType(savedFormData.testType || "chapterwise");
      }

      if (savedQuestions && savedQuestions.length > 0) {
        setQuestions(savedQuestions);
        setStep(2);
      }

      if (isEditing || fromEdit) {
        setIsEditMode(true);
        if (fromEdit) {
          message.success("Test details updated! Returning to questions...");
        } else {
          message.info("Edit mode: Update your test details");
        }
      }
    }
  }, [location.state]);

  const isChapterWiseStep = step === 2 && testType === "chapterwise";

  const handleFormFieldChange = (field: keyof TestFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getQuestionSidebarItems = () => {
    if (isChapterWiseStep && questions.length > 0) {
      return questions.map((q, idx) => ({
        key: `question-${q.id}`,
        icon: <CheckOutlined />,
        
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>Question {idx + 1}</span>
            <DoubleRightOutlined className="question-arrow" />
          </div>
        ),
      }));
    }
    return [];
  };

  const handleQuestionsChange = (updatedQuestions: Question[]) => {
    setQuestions(updatedQuestions);
    if (updatedQuestions.length > 0 && !selectedQuestionId) {
      setSelectedQuestionId(String(updatedQuestions[0].id));
    }
  };

  const handleSidebarItemClick = (key: string) => {
    if (key.startsWith("question-")) {
      const questionId = key.replace("question-", "");
      setSelectedQuestionId(questionId);
    }
  };

  const getSelectedKey = () => {
    if (isChapterWiseStep && selectedQuestionId) {
      return `question-${selectedQuestionId}`;
    }
    return "/create-test";
  };

  const handleNext = () => {
    if (!formData.testName) {
      message.error("Please enter test name");
      return;
    }
    if (!formData.subject) {
      message.error("Please select subject");
      return;
    }
    if (!formData.duration) {
      message.error("Please enter duration");
      return;
    }
    if (testType === "chapterwise") {
      if (!formData.topic) {
        message.error("Please select topic");
        return;
      }
    }
    if (testType === "pyq") {
      if (!formData.exam) {
        message.error("Please select exam");
        return;
      }
      if (!formData.year) {
        message.error("Please select year");
        return;
      }
    }
    if (testType === "mock") {
      if (!formData.questionsCount) {
        message.error("Please enter questions count");
        return;
      }
    }

    if (isEditMode) {
      setStep(2);
      setIsEditMode(false);
      setBackupFormData(null);
      message.success("Test details updated successfully!");
    } else {
      setStep(2);
    }
  };

  const handleBackFromMCQ = () => {
    setStep(1);
    setSelectedQuestionId("");
    setIsEditMode(false);
    setBackupFormData(null);
  };

  const handleEditTestDetails = () => {
    setBackupFormData({ ...formData });
    setStep(1);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    if (backupFormData) {
      setFormData(backupFormData);
      setTestType(backupFormData.testType || "chapterwise");
      setBackupFormData(null);
    }
    setStep(2);
    setIsEditMode(false);
    message.info("Edit cancelled. Returning to questions without changes.");
  };

  const handlePublish = (finalQuestions: Question[]) => {
    const completeTestData = {
      ...formData,
      testType,
      questions: finalQuestions,
      totalQuestions: finalQuestions.length,
      createdAt: new Date().toISOString(),
    };

    console.log("Publishing Test Data:", completeTestData);
    message.success(`Test "${formData.testName}" Published Successfully with ${finalQuestions.length} questions!`);

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <Dashboardlayout
      hideSidebar={false}
      customSidebarItems={getQuestionSidebarItems()}
      onCustomSidebarItemClick={handleSidebarItemClick}
      selectedCustomKey={getSelectedKey()}
      sidebarMenuClassName={isChapterWiseStep && questions.length > 0 ? "question-menu-green" : undefined}
      showOriginalMenu={true}
      totalQuestionsCount={questions.length} 
    >
      <Card
        bordered={false}
        style={{
          background: isChapterWiseStep ? "#f9fafb" : "none",
          boxShadow: "none",
          padding: isChapterWiseStep ? 0 : 0,
          borderRadius: isChapterWiseStep ? 0 : undefined,
        }}
      >
        {step === 1 && (
          <>
            {/* BREADCRUMB HEADER */}
            <div className="breadcrumb-header" style={{ marginBottom: 24 }}>
              <div className="chapter-breadcrumb">
                <span>Test Creation</span>
                <span className="slash">/</span>
                <span>Create Test</span>
                <span className="slash">/</span>
                <span className="active-text">
                  {testType === "chapterwise"
                    ? "Chapter Wise"
                    : testType === "pyq"
                    ? "PYQ"
                    : "Mock Test"}
                </span>
              </div>
            </div>

            <Title
              level={4}
              style={{
                marginBottom: 16,
                fontSize: "16px",
                fontWeight: 200,
              }}
            >
              {isEditMode ? "✏️ Edit Test Details" : "Test Details"}
            </Title>

            <div style={{ marginBottom: 24 }}>
              <Segmented
                size="large"
                value={testType}
                onChange={(value) => {
                  setTestType(value as string);
                  setFormData((prev) => ({ ...prev, testType: value as string }));
                }}
                options={[
                  { label: "Chapter Wise", value: "chapterwise" },
                  { label: "PYQ", value: "pyq" },
                  { label: "Mock Test", value: "mock" },
                ]}
                className="violet-segmented"
                disabled={isEditMode && questions.length > 0}
              />
            </div>

            <Form layout="vertical">
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <Form.Item label="Subject" required>
                    <Select
                      size="large" 
                      placeholder="Select Subject"
                      value={formData.subject}
                      onChange={(value) => handleFormFieldChange("subject", value)}
                      options={[
                        { label: "English", value: "english" },
                        { label: "Mathematics", value: "mathematics" },
                        { label: "Science", value: "science" },
                        { label: "Social Studies", value: "social-studies" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Name of the Test" required>
                    <Input
                      className="custom-input"
                      size="large"
                      placeholder="Enter Test Name"
                      value={formData.testName}
                      onChange={(e) => handleFormFieldChange("testName", e.target.value)}
                    />
                  </Form.Item>
                </Col>

                {testType === "chapterwise" && (
                  <>
                    <Col xs={24} md={12}>
                      <Form.Item label="Topic" required>
                        <Select
                          size="large"
                          placeholder="Select Topic"
                          value={formData.topic}
                          onChange={(value) => handleFormFieldChange("topic", value)}
                          options={[
                            { label: "Grammar", value: "grammar" },
                            { label: "Vocabulary", value: "vocabulary" },
                            { label: "Reading Comprehension", value: "reading" },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Sub Topic">
                        <Select
                          size="large"
                          placeholder="Select Sub Topic"
                          value={formData.subTopic}
                          onChange={(value) => handleFormFieldChange("subTopic", value)}
                          options={[
                            { label: "Tenses", value: "tenses" },
                            { label: "Parts of Speech", value: "parts-of-speech" },
                            { label: "Active Passive", value: "active-passive" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}

                {testType === "pyq" && (
                  <>
                    <Col xs={24} md={12}>
                      <Form.Item label="Exam" required>
                        <Select
                          size="large"
                          placeholder="Select Exam"
                          value={formData.exam}
                          onChange={(value) => handleFormFieldChange("exam", value)}
                          options={[
                            { label: "JEE Main", value: "jee-main" },
                            { label: "NEET", value: "neet" },
                            { label: "UPSC", value: "upsc" },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Year" required>
                        <Select
                          size="large"
                          placeholder="Select Year"
                          value={formData.year}
                          onChange={(value) => handleFormFieldChange("year", value)}
                          options={[
                            { label: "2024", value: "2024" },
                            { label: "2023", value: "2023" },
                            { label: "2022", value: "2022" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}

                {testType === "mock" && (
                  <Col xs={24} md={12}>
                    <Form.Item label="Questions Count" required>
                      <InputNumber
                        size="large"
                        style={{ width: "100%" }}
                        placeholder="Enter Question Count"
                        value={formData.questionsCount}
                        onChange={(value) => handleFormFieldChange("questionsCount", value)}
                      />
                    </Form.Item>
                  </Col>
                )}

                <Col xs={24} md={12}>
                  <Form.Item label="Duration (Minutes)" required>
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Enter Duration"
                      value={formData.duration}
                      onChange={(value) => handleFormFieldChange("duration", value)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Test Difficulty Level">
                    <Radio.Group
                      size="large"
                      value={formData.difficultyLevel}
                      onChange={(e) => handleFormFieldChange("difficultyLevel", e.target.value)}
                    >
                      <Radio value="easy" >Easy</Radio>
                      <Radio value="medium">Medium</Radio>
                      <Radio value="hard">Difficult</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Title level={5}>Marking Scheme</Title>

              <Row gutter={20}>
                <Col xs={24} md={4}>
                  <Form.Item label="Wrong Answer">
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="-1"
                      value={formData.wrongAnswerMarks}
                      onChange={(value) => handleFormFieldChange("wrongAnswerMarks", value)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item label="Unattempted">
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="0"
                      value={formData.unattemptedMarks}
                      onChange={(value) => handleFormFieldChange("unattemptedMarks", value)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item label="Correct Answer">
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="+4"
                      value={formData.correctAnswerMarks}
                      onChange={(value) => handleFormFieldChange("correctAnswerMarks", value)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="No of Questions">
                    <Input
                      size="large"
                      placeholder="Ex: 50"
                      value={formData.noOfQuestions}
                      onChange={(e) => handleFormFieldChange("noOfQuestions", e.target.value)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label="Total Marks">
                    <Input
                      size="large"
                      placeholder="Ex: 250 Marks"
                      value={formData.totalMarks}
                      onChange={(e) => handleFormFieldChange("totalMarks", e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ textAlign: "right", marginTop: 24 }}>
                <Space>
                  <Button size="large" style={{ width: 120 }} onClick={handleCancelEdit}>
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    size="large"
                    style={{ width: 120 }}
                    onClick={handleNext}
                  >
                    {isEditMode ? "Save Change" : "Next"}
                  </Button>
                </Space>
              </div>
            </Form>
          </>
        )}

        {step === 2 && testType === "chapterwise" && (
          <ChapterWiseMCQ
            onBack={handleBackFromMCQ}
            onQuestionsChange={handleQuestionsChange}
            selectedQuestionId={selectedQuestionId}
            onPublish={handlePublish}
            testFormData={formData}
            onEditTestDetails={handleEditTestDetails}
          />
        )}
      </Card>
    </Dashboardlayout>
  );
}