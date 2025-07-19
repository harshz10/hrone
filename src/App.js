import React from 'react';
import { Layout, Typography } from 'antd';
import SchemaBuilder from './SchemaBuilder';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '14px 0' }}>Harsh Nagar JSON Schema </Title>
      </Header>
      <Content style={{ padding: '20px 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <SchemaBuilder />
        </div>
      </Content>
    </Layout>
  );
}

export default App;