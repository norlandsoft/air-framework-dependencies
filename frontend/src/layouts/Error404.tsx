import {Button, Result} from 'air-design';

const Error404: React.FC = () => {
  return (
      <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在。"
          extra={
            <Button type="primary" onClick={() => window.location.href = '/'}>
              返回首页
            </Button>
          }
      />
  );
};

export default Error404;
