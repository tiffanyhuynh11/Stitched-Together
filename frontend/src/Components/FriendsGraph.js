import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Circle, Text, Line } from 'react-konva';
import useWindowSize from './useWindowSize';

const USER_RADIUS = 40;
const FRIEND_RADIUS = 30;

const FriendsGraph = ({ user, friends }) => {
  const { width, height } = useWindowSize();
  const centerX = width / 2;
  const centerY = height / 2;
  const [nodes, setNodes] = useState([]);
   

  // if the user added friends, randomizes the position of friend bubbles
  useEffect(() => {
    if (!friends) return;
    const initialized = friends.map((friend) => ({
      ...friend,
      x: Math.random() * width,
      y: Math.random() * height,
    }));
    setNodes(initialized);
  }, [friends, width, height]);  

  // update position of dragged node
  const handleDragMove = (index, pos) => {
    const updated = [...nodes];
    updated[index].x = pos.x;
    updated[index].y = pos.y;
    setNodes(updated);
  };

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/*User's bubble*/}
        <Circle
          x={centerX}
          y={centerY}
          radius={USER_RADIUS}
          fill="#f6a192"
          shadowBlur={8}
        />
        <Text
          x={centerX - 30}
          y={centerY - 10}
          text={"My Name"}
          fontSize={14}
          fill="white"
        />

        {/*Draw lines from user to each friend*/}
        {nodes.map((friend, i) => (
          <Line
            key={`line-${i}`}
            points={[centerX, centerY, friend.x, friend.y]}
            stroke="#f6b092"
            strokeWidth={2}
          />
        ))}

        {/*Friend bubbles*/}
        {nodes.map((friend, i) => (
          <React.Fragment key={`friend-${i}`}>
            <Circle
              x={friend.x}
              y={friend.y}
              radius={FRIEND_RADIUS}
              fill="#f6d992"
              shadowBlur={4}
              draggable
              onDragMove={(e) => handleDragMove(i, e.target.position())}
            />
            <Text
              x={friend.x - 25}
              y={friend.y - 8}
              text={friend.name}
              fontSize={12}
              fill="#333"
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
};

export default FriendsGraph;
