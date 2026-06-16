import { Card,Typography,Radio,Tag,Button,  Input,Select, Space, Tooltip, Spin, Segmented, DatePicker, TimePicker} from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined, ClockCircleOutlined, FileTextOutlined, TrophyOutlined, EditOutlined, DownloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import "./ChapterWiseMCQ.css";
import Chapter_1 from '../../assets/icons/chapter-1.svg';
import { useChapterWiseMCQ } from "./useChapterMCQ";
import type { ChapterWiseMCQProps } from "./ChapterWiseMCQ.types";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;



export default function ChapterWiseMCQ({
  onBack,
  onQuestionsChange,
  selectedQuestionId,
  onPublish,
  testFormData: propTestFormData,
  testId,
  onEditTestDetails,
}: ChapterWiseMCQProps) {
  
  const {
    testFormData,
    questions,
    currentIndex,
    maxQuestions,
    showPublishScreen,
    pageLoading,
    publishState,
    currentQuestion,
    setShowPublishScreen,
    setPublishState,
    updateQuestion,
    updateOption,
    addQuestion,
    clearQuestion,
    saveQuestion,
    publishTest,
    handleConfirmPublish,
    handleExportCSV,
  } = useChapterWiseMCQ(propTestFormData, testId, onQuestionsChange, onPublish, selectedQuestionId);
  
 const updatePublishState = (key: string, value: any) => {
    setPublishState((prev: any) => ({ ...prev, [key]: value }));
  };

if (pageLoading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" />
      <Text style={{ marginLeft: 16 }}>Loading test data...</Text>
    </div>
  );
}
  return (
    <div className="chapter-mcq-page">
      {/* HEADER */}
      <div className="breadcrumb-header">
        <div className="chapter-breadcrumb">
          <span>Test Creation</span>
          {!showPublishScreen  && (
            <>
          <span className="slash">/</span>
          <span>Create Test</span>
          <span className="slash">/</span>
          <span className="active-text">Chapter Wise</span>
          </>
          )}
        </div>
   
{!showPublishScreen  && (
       <Button 
  type="primary" 
  className="publish-btn" 
  onClick={publishTest}
  loading={pageLoading}
>
  Publish Test
</Button>
)}

      </div>
      {showPublishScreen && (
      <div className="test-status-section">
        <Space size="large" align="center">
          <div className="test-created">
            
            <Text strong style={{ marginLeft: '8px', fontSize: '16px' }}>
              Test created
            </Text>
          </div>
          
          <div className="questions-status">
            <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px',background:'white',border:'1px solid #52c41a',borderRadius:'10px',margin:'10px' }}>
             <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} /> All {maxQuestions} Questions done
            </Tag>
          </div>
        </Space>
      </div>
    )}
      {/* TOP CARD - Displaying Form Data with Edit Button */}
      <Card className="chapter-info-card">
        <div className="chapter-badge">Chapter Wise</div>

        <div className="chapter-top">
          <div style={{ flex: 1 }}>
            <div className="chapter-title-row">
              <Title level={5} style={{ margin: 0 }}>
                <img src={Chapter_1}/> {testFormData?.testName || "Untitled Test"}
              </Title>
             <Tag
  className={`difficulty-tag ${
    testFormData?.difficultyLevel === "easy"
      ? "easy"
      : testFormData?.difficultyLevel === "medium"
      ? "medium"
      : "hard"
  }`}
>
  {testFormData?.difficultyLevel === "easy" ? (
    <CheckCircleOutlined />
  ) : testFormData?.difficultyLevel === "medium" ? (
    <ExclamationCircleOutlined />
  ) : (
    <CloseCircleOutlined />
  )}

  <span style={{ marginLeft: 6 }}>
    {testFormData?.difficultyLevel || "Easy"}
  </span>
</Tag>
            </div>

            <div className="chapter-meta">
              <div>
                <Text type="secondary">Subject</Text>
                <span>{testFormData?.subject}</span>
              </div>

              <div>
                <Text type="secondary">Topic</Text>
                <div className="tag-row">
                  <Tag className="topic-tag">{testFormData?.topic || "Not Selected"}</Tag>
                </div>
              </div>

              <div>
                <Text type="secondary">Sub Topic</Text>
                <div className="tag-row">
                  <Tag className="topic-tag">{testFormData?.subTopic || "Not Selected"}</Tag>
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
                marginTop: 130,
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
                  <ClockCircleOutlined style={{ color: "gray" }} /> 
                  <strong>{testFormData?.duration || 0}</strong> Min
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <FileTextOutlined style={{ color: "gray" }} /> 
                  <strong>{questions.length}</strong>/{maxQuestions} Q's
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <TrophyOutlined style={{ color: "gray" }} /> 
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
          <Button type="link" danger icon={<DeleteOutlined />} className="delete-btn" onClick={clearQuestion}>
            Delete All Edits
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
     <div className="editor-container" key={`editor-${currentQuestion.id}`}>
        <div className="toolbar">
          <span>B</span>
          <span>I</span>
          <span>U</span>
          <span>•</span>
          <span>≡</span>
        </div>

        <TextArea
          key={`question-text-${currentQuestion.id}`}
          rows={7}
          placeholder="Type your question here..."
          value={currentQuestion.text}
          onChange={(e) => updateQuestion("text", e.target.value)}
          className="editor-input"
        />
      </div>

      {/* OPTIONS */}
      <div className="options-wrapper" key={`options-${currentQuestion.id}`}>
        <Text className="options-title">Type the options below</Text>

      {currentQuestion.options.map((option, index) => (
  <div className="option-item" key={`${currentQuestion.id}-option-${index}`}>
            <input
              type="radio"
               name={`correctAnswer-${currentQuestion.id}`}
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
         key={`solution-${currentQuestion.id}`}
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
            <Text className="label">Level of Difficulty</Text>
            <Select
             key={`difficulty-${currentQuestion.id}`}
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
            key={`topic-${currentQuestion.id}`}
              size="large"
              value={currentQuestion.topic}
              onChange={(e) => updateQuestion("topic", e.target.value)}
              placeholder="Enter topic name"
            />
          </div>

          <div>
            <Text className="label">Sub Topic</Text>
            <Input
            key={`subtopic-${currentQuestion.id}`}
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
        <Button danger onClick={onBack} className="exit-chap">
          Exit Test Creation
        </Button>

        <Space>
          
          <Button type="primary" icon={<SaveOutlined />} onClick={saveQuestion}>
            Save Question
          </Button>
        </Space>
      </div>
      </>
         ) : (
  // Publish Screen with Ant Design Components
  <div className="publish-review-page">
    {/* Segmented Publish Type Buttons */}
    <Segmented
      value={publishState.publishType}
      onChange={(value) => updatePublishState('publishType', value as 'now' | 'schedule')}
      options={[
        { label: "Publish Now", value: "now" },
        { label: "Schedule Publish", value: "schedule" },
      ]}
      className="publish-segmented"
    />

    {/* Schedule Publish Section */}
    {publishState.publishType === 'schedule' && (
      <div className="schedule-section">
        <Title level={5}>Select Date and Time</Title>
        <div className="datetime-picker-wrapper">
          <div className="datetime-field">
            <DatePicker
              className="datetime-input"
              placeholder="Select Date"
              value={publishState.scheduleDate ? dayjs(publishState.scheduleDate) : null}
              onChange={(date) => updatePublishState('scheduleDate', date ? date.format('YYYY-MM-DD') : '')}
              style={{ width: '100%' }}
            />
          </div>
          <div className="datetime-field">
            <TimePicker
              className="datetime-input"
              placeholder="Select Time"
              value={publishState.scheduleTime ? dayjs(publishState.scheduleTime, 'HH:mm') : null}
              onChange={(time) => updatePublishState('scheduleTime', time ? time.format('HH:mm') : '')}
              format="HH:mm"
              style={{ width: '100%' }}
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
        value={publishState.liveUntil}
        onChange={(e) => updatePublishState('liveUntil', e.target.value)}
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
      {publishState.liveUntil === 'custom' && (
        <div className="custom-date-wrapper">
          <Text className="field-label">Select End Date</Text>
          <DatePicker
            className="end-date-input"
            placeholder="Select End Date"
            value={publishState.customEndDate ? dayjs(publishState.customEndDate) : null}
            onChange={(date) => updatePublishState('customEndDate', date ? date.format('YYYY-MM-DD') : '')}
            style={{ width: '100%' }}
          />
          <Text className="field-label" style={{ marginTop: 12 }}>Select End Time</Text>
          <TimePicker
            className="end-time-input"
            placeholder="Select End Time"
            value={publishState.customEndTime ? dayjs(publishState.customEndTime, 'HH:mm') : null}
            onChange={(time) => updatePublishState('customEndTime', time ? time.format('HH:mm') : '')}
            format="HH:mm"
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>

    {/* Start Date/Time for Publish Now */}
    {publishState.publishType === 'now' && (
      <div className="schedule-section">
        <div className="datetime-picker-wrapper">
          <div className="datetime-field">
            <Text className="field-label">Start Date</Text>
            <DatePicker
              className="datetime-input"
              placeholder="Select Start Date"
              value={publishState.startDate ? dayjs(publishState.startDate) : null}
              onChange={(date) => updatePublishState('startDate', date ? date.format('YYYY-MM-DD') : '')}
              style={{ width: '100%' }}
            />
          </div>
          <div className="datetime-field">
            <Text className="field-label">Start Time</Text>
            <TimePicker
              className="datetime-input"
              placeholder="Select Start Time"
              value={publishState.startTime ? dayjs(publishState.startTime, 'HH:mm') : null}
              onChange={(time) => updatePublishState('startTime', time ? time.format('HH:mm') : '')}
              format="HH:mm"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    )}

    {/* Action Buttons */}
    <div className="publish-actions">
      <Button size="large" onClick={() => setShowPublishScreen(false)}>Cancel</Button>
      <Button 
        type="primary" 
        size="large" 
        onClick={handleConfirmPublish}
        loading={pageLoading}
      >
        Confirm
      </Button>
    </div>
  </div>
)}
      </div>
 
    
  );
}