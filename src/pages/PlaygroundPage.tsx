import OrderStatusSelector from '../components/OrderStatusSelector';

const PlaygroundPage = () => {
  return <OrderStatusSelector onChange={() => console.log('changed')} />;
};

export default PlaygroundPage;
