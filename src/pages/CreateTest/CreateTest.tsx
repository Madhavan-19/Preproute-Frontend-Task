import { Card, Form, Input, Select, Button, Row, Col, Segmented, Radio, InputNumber, Typography, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import Dashboardlayout from "../../components/DashboardLayout/Dashboardlayout";
import ChapterWiseMCQ from "../ChapterWise/ChapterWiseMCQ";
import { useCreateTest } from "./useCreateTest";
import { CheckOutlined, DoubleRightOutlined } from "@ant-design/icons";
import "./CreateTest.css";

const { Title } = Typography;

export default function CreateTest() {
  const navigate = useNavigate();
  const {
    testType, setTestType,
    step, setStep,
    questions,
    selectedQuestionId, setSelectedQuestionId,
    isEditMode, setIsEditMode,
    formData,
    loading,
    handleFormFieldChange,
    handleQuestionsChange,
    handleNext,
    handlePublish,
    subjects,
    subTopics,
    topics,
    subjectsLoading,
    topicsLoading,
    subTopicsLoading
  } = useCreateTest();

  const isChapterWiseStep = step === 2 && testType === "chapterwise";

  const getQuestionSidebarItems = () => {
    if (!isChapterWiseStep || !questions.length) return [];
    return questions.map((_, idx) => ({
      key: `question-${idx}`,
      icon: <CheckOutlined />,
      label: (
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span>Question {idx + 1}</span>
          <DoubleRightOutlined className="question-arrow" />
        </div>
      ),
    }));
  };

  const handleBackFromMCQ = () => {
    setStep(1);
    setSelectedQuestionId("");
    setIsEditMode(false);
  };

  const handleEditTestDetails = () => {
    setStep(1);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const TEST_TYPE_OPTIONS = [
    { label: "Chapter Wise", value: "chapterwise" },
    { label: "PYQ", value: "pyq" },
    { label: "Mock Test", value: "mock" },
  ];

  const renderLoadingContent = (
    loading: boolean,
    text: string
  ) =>
    loading ? (
      <div className="loading-wrapper">
        <Spin size="small" />
        <div className="loading-text">{text}</div>
      </div>
    ) : (
      "No Data"
    );

  const selectedKey = isChapterWiseStep && selectedQuestionId
    ? `question-${selectedQuestionId}`
    : "/create-test";

  return (
    <Dashboardlayout
      customSidebarItems={getQuestionSidebarItems()}
      onCustomSidebarItemClick={(key) => setSelectedQuestionId(key.replace("question-", ""))}
      selectedCustomKey={selectedKey}
      sidebarMenuClassName={isChapterWiseStep && questions.length > 0 ? "question-menu-green" : undefined}
      showOriginalMenu={true}
      totalQuestionsCount={questions.length}
    >
      <Card bordered={false} style={{ background: isChapterWiseStep ? "#f9fafb" : "none", boxShadow: "none", padding: 0 }}>
        {step === 1 ? (
          <>
            <div className="breadcrumb-header" style={{ marginBottom: 13 }}>
              <div className="chapter-breadcrumb">
                <span>Test Creation / Create Test /
                  <span className="active-text">
                    {testType === "chapterwise" ? "Chapter Wise" : testType === "pyq" ? "PYQ" : "Mock Test"}
                  </span>
                </span>
              </div>
            </div>

            <Title level={4} style={{ marginBottom: 8, fontSize: "16px", fontWeight: 200 }}>
              {isEditMode ? "✏️ Edit Test Details" : "Test Details"}
            </Title>

            <Segmented
              value={testType}
              onChange={(value) => setTestType(value as string)}
              options={TEST_TYPE_OPTIONS}
              className="violet-segmented"
              disabled={isEditMode && questions.length > 0}
              style={{ marginBottom: 10 }}
            />

            <Form layout="vertical">
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <Form.Item label="Subject" required>
                    <Select
                      size="large"
                      placeholder="Select Subject"
                      value={formData.subject}
                      loading={subjectsLoading}
                      disabled={isEditMode}
                      notFoundContent={renderLoadingContent(
                        subjectsLoading,
                        "Waiting for data..."
                      )}
                      onChange={(v) => handleFormFieldChange("subject", v)}
                      options={subjects.map((s) => ({
                        label: s.name,
                        value: s.id,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Name of the Test" required>
                    <Input size="large" placeholder="Enter Test Name" value={formData.testName}
                      onChange={(e) => handleFormFieldChange("testName", e.target.value)} />
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
                          loading={topicsLoading}
                          disabled={!formData.subject || isEditMode}
                          notFoundContent={renderLoadingContent(
                            topicsLoading,
                            "Waiting for topics..."
                          )}
                          onChange={(v) => handleFormFieldChange("topic", v)}
                          options={topics.map((t) => ({
                            label: t.name,
                            value: t.id,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Sub Topic">
                        <Select
                          size="large"
                          placeholder="Select Sub Topic"
                          value={formData.subTopic}
                          loading={subTopicsLoading}
                          disabled={!formData.topic || isEditMode} 
                          notFoundContent={renderLoadingContent(
                            subTopicsLoading,
                            "Waiting for sub topics..."
                          )}
                          onChange={(v) => handleFormFieldChange("subTopic", v)}
                          options={subTopics.map((s) => ({
                            label: s.name,
                            value: s.id,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}

                {testType === "pyq" && (
                  <>
                    <Col xs={24} md={12}>
                      <Form.Item label="Exam" required>
                        <Select size="large" placeholder="Select Exam" value={formData.exam}
                          onChange={(v) => handleFormFieldChange("exam", v)}>
                          {["JEE Main", "NEET", "UPSC"].map(e =>
                            <Select.Option key={e.toLowerCase()} value={e.toLowerCase()}>{e}</Select.Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Year" required>
                        <Select size="large" placeholder="Select Year" value={formData.year}
                          onChange={(v) => handleFormFieldChange("year", v)}>
                          {["2024", "2023", "2022"].map(y =>
                            <Select.Option key={y} value={y}>{y}</Select.Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                  </>
                )}

                {testType === "mock" && (
                  <Col xs={24} md={12}>
                    <Form.Item label="Questions Count" required>
                      <InputNumber size="large" className="full-width" placeholder="Enter Question Count"
                        value={formData.questionsCount} onChange={(v) => handleFormFieldChange("questionsCount", v)} />
                    </Form.Item>
                  </Col>
                )}

                <Col xs={24} md={12}>
                  <Form.Item label="Duration (Minutes)" required>
                    <InputNumber size="large" className="full-width" placeholder="Enter Duration" 
                      value={formData.duration} onChange={(v) => handleFormFieldChange("duration", v)} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Test Difficulty Level">
                    <Radio.Group value={formData.difficultyLevel} onChange={(e) => handleFormFieldChange("difficultyLevel", e.target.value)}  disabled={isEditMode}>
                      <Radio value="easy">Easy</Radio>
                      <Radio value="medium">Medium</Radio>
                      <Radio value="hard">Difficult</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <h4 style={{ marginBottom: 10 }}>Marking Scheme :</h4>
              <Row gutter={20}>
                <Col xs={24} md={4}>
                  <Form.Item label="Wrong Answer" >
                    <InputNumber size="large" className="full-width" placeholder="-1"  disabled={isEditMode}
                      value={formData.wrongAnswerMarks} onChange={(v) => handleFormFieldChange("wrongAnswerMarks", v)} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item label="Unattempted">
                    <InputNumber size="large" className="full-width" placeholder="0"  disabled={isEditMode}
                      value={formData.unattemptedMarks} onChange={(v) => handleFormFieldChange("unattemptedMarks", v)} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item label="Correct Answer">
                    <InputNumber size="large" className="full-width" placeholder="+4"  disabled={isEditMode}
                      value={formData.correctAnswerMarks} onChange={(v) => handleFormFieldChange("correctAnswerMarks", v)} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="No of Questions">
                    <Input size="large" placeholder="Ex: 50" value={formData.noOfQuestions}
                      onChange={(e) => handleFormFieldChange("noOfQuestions", e.target.value)} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Total Marks">
                    <Input size="large" placeholder="Ex: 250 Marks" value={formData.totalMarks}
                      onChange={(e) => handleFormFieldChange("totalMarks", e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>

              <div className="action-btn">
                <Space>
                  <Button className='create-btn-c1 btn-width' size="large" onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" className="create-btn btn-width" size="large" onClick={handleNext} loading={loading}>
                    {isEditMode ? "Save Change" : "Next"}
                  </Button>
                </Space>
              </div>
            </Form>
          </>
        ) : (
          <ChapterWiseMCQ
            onBack={handleBackFromMCQ}
            onQuestionsChange={handleQuestionsChange}
            selectedQuestionId={selectedQuestionId}
            onPublish={handlePublish}
            testFormData={formData}
            onEditTestDetails={handleEditTestDetails}
            loading={loading}
          />
        )}
      </Card>
    </Dashboardlayout>
  );
}