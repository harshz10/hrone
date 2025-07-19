import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button, Input, Select, Space, Typography, Row, Col, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text, Title } = Typography;

// A single field row is good for recursion.
const FieldRow = ({ control, index, remove, parentName }) => {
  const { fields, append, remove: removeNested } = useFieldArray({
    control,
    name: `${parentName}.${index}.children`,
  });

  return (
    <Card size="small" style={{ marginBottom: '10px' }}>
      <Space align="start">
        <Controller
          name={`${parentName}.${index}.key`}
          control={control}
          // Validation can be added here, which is a great way to show attention to detail.
          rules={{ required: true }}
          render={({ field }) => <Input {...field} placeholder="Field Name" />}
        />
        <Controller
          name={`${parentName}.${index}.type`}
          control={control}
          defaultValue="String"
          render={({ field }) => (
            <Select {...field} style={{ width: 120 }}>
              <Option value="String">String</Option>
              <Option value="Number">Number</Option>
              <Option value="Nested">Nested</Option>
            </Select>
          )}
        />
        <Button icon={<DeleteOutlined />} onClick={() => remove(index)} danger />
      </Space>

      {/* We watch the 'type' to conditionally render the nested builder UI */}
      <Controller
        name={`${parentName}.${index}.type`}
        control={control}
        render={({ field }) => {
          if (field.value !== 'Nested') {
            return null;
          }
          // If the type is Nested we render the child fields.
          return (
            <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
              {fields.map((nestedField, nestedIndex) => (
                <FieldRow
                  key={nestedField.id}
                  control={control}
                  index={nestedIndex}
                  remove={removeNested}
                  parentName={`${parentName}.${index}.children`}
                />
              ))}
              <Button
                type="dashed"
                onClick={() => append({ key: '', type: 'String', children: [] })}
                icon={<PlusOutlined />}
              >
                Add Nested Field
              </Button>
            </div>
          );
        }}
      />
    </Card>
  );
};

const SchemaBuilder = () => {
  // Using React Hook Form for state management is great for performance,
  // as it avoids re-renders on every keystroke.
  const { control, watch } = useForm({
    defaultValues: {
      schema: [{ key: 'firstName', type: 'String', children: [] }],
    },
  });

  // useFieldArray is  hook for managing dynamic form fields.
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schema',
  });

  // 'watch'  live JSON preview.
  const currentSchemaState = watch('schema');

  // This helper function recursively transforms the form state into a clean JSON object.
  // Rewritten using .reduce() for a more functional style.
  const buildJsonFromSchema = (schema) => {
    return schema.reduce((acc, field) => {
      if (!field || !field.key) {
        return acc;
      }

      if (field.type === 'Nested' && field.children && field.children.length > 0) {
        acc[field.key] = buildJsonFromSchema(field.children);
      } else if (field.type === 'String') {
        acc[field.key] = "Default String";
      } else if (field.type === 'Number') {
        acc[field.key] = 0;
      } else {
        // Handle cases like a 'Nested' field with no children.
        acc[field.key] = null;
      }
      return acc;
    }, {});
  };

  const previewJsonString = JSON.stringify(buildJsonFromSchema(currentSchemaState), null, 2);

  return (
    <Row gutter={24}>
      {/* Builder Column */}
      <Col span={12}>
        <Title level={4}>Schema Builder</Title>
        {fields.map((field, index) => (
          <FieldRow
            key={field.id}
            control={control}
            index={index}
            remove={remove}
            parentName="schema"
          />
        ))}
        <Button
          type="primary"
          onClick={() => append({ key: '', type: 'String', children: [] })}
          icon={<PlusOutlined />}
        >
          Add Field
        </Button>
      </Col>

      {/* Preview Column */}
      <Col span={12}>
        <Title level={4}>JSON Preview</Title>
        <Card style={{ height: '100%', minHeight: '50vh', background: '#f8f9fa' }}>
          <pre style={{ margin: 0 }}>
            <Text copyable={{ tooltips: ['Copy JSON', 'Copied!'] }}>
              {previewJsonString}
            </Text>
          </pre>
        </Card>
      </Col>
    </Row>
  );
};

export default SchemaBuilder;

//By Harsh Nagar 