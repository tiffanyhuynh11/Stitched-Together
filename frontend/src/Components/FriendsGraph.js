import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Circle, Text, Line, Group } from 'react-konva';
import useWindowSize from './useWindowSize';
import { useNavigate } from 'react-router-dom';

const USER_RADIUS = 40;
const FRIEND_RADIUS = 30;

const randomizePosition = (existingNodes, centerX, centerY, width, height) => {
  const minDistance = USER_RADIUS + FRIEND_RADIUS + 40;
  const maxAttempts = 1000;
  let x, y, valid, attempts = 0;

  do {
    x = Math.random() * (width - 2 * FRIEND_RADIUS) + FRIEND_RADIUS;
    y = Math.random() * (height - 2 * FRIEND_RADIUS) + FRIEND_RADIUS;

    const dx = x - centerX;
    const dy = y - centerY;
    const distFromUser = Math.sqrt(dx * dx + dy * dy);
    valid = distFromUser >= minDistance;

    if (valid) {
      for (let node of existingNodes) {
        const fx = node.relX * width;
        const fy = node.relY * height;
        const df = Math.sqrt((x - fx) ** 2 + (y - fy) ** 2);
        if (df < 2 * FRIEND_RADIUS + 10) {
          valid = false;
          break;
        }
      }
    }
    attempts++;
  } while (!valid && attempts < maxAttempts);

  return { x, y };
};

const FriendsGraph = ({ user, friends }) => {
  const { width, height } = useWindowSize();
  const centerX = width / 2;
  const centerY = height / 2;
  const navigate = useNavigate();

  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingConnection, setPendingConnection] = useState(null);
  const [input, setInput] = useState('');
  const [hover, setHover] = useState(null);
  const groupRefs = useRef([]);
  const dragState = useRef(false);

  useEffect(() => {
    if (!Array.isArray(friends) || friends.length === 0 || nodes.length > 0 || !width || !height) return;

    const placed = [];

    const initialized = friends.map(friend => {
      const { x, y } = randomizePosition(placed, centerX, centerY, width, height);
      const relX = x / width;
      const relY = y / height;
      placed.push({ relX, relY });
      return { ...friend, relX, relY };
    });

    setNodes(initialized);
  }, [friends, width, height]);

  // Prevent crashing due to undefined fields
  if (!user || !Array.isArray(friends) || !width || !height) return null;

  // This part needs to update the DB
  const handleSubmit = () => {
    const { fromId, toId, originIndex } = pendingConnection;
    const trimmed = input.trim();

    setConnections(prev => {
      const existingIndex = prev.findIndex(c =>
        (c.fromId === fromId && c.toId === toId) ||
        (c.fromId === toId && c.toId === fromId)
      );

      if (trimmed === '') {
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated.splice(existingIndex, 1);
          return updated;
        }
        return prev;
      } else {
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { fromId, toId, relationship: trimmed };
          return updated;
        } else {
          return [...prev, { fromId, toId, relationship: trimmed }];
        }
      }
    });

    const { x: newX, y: newY } = randomizePosition(nodes, centerX, centerY, width, height);

    setNodes(prev => {
      const updated = [...prev];
      updated[originIndex] = {
        ...updated[originIndex],
        relX: newX / width,
        relY: newY / height
      };
      return updated;
    });

    setPendingConnection(null);
    setInput('');
  };

  return (
    <>
      <Stage width={width} height={height}>
        <Layer>
          {/*Friend Relationships*/}
          {connections.map((conn, idx) => {
            const from = nodes.find(n => n.id === conn.fromId);
            const to = nodes.find(n => n.id === conn.toId);
            if (!from || !to) return null;

            const x1 = from.relX * width;
            const y1 = from.relY * height;
            const x2 = to.relX * width;
            const y2 = to.relY * height;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const showLabel =
              hover === conn.fromId || hover === conn.toId;

            return (
              <Group key={`conn-${idx}`}>
                <Line
                  points={[x1, y1, x2, y2]}
                  stroke="#f6b092"
                  strokeWidth={2}
                  dash={[4, 2]}
                />
                {showLabel && (
                  <Text
                    text={conn.relationship}
                    x={midX - 50}
                    y={midY - 10}
                    width={100}
                    align="center"
                    fontSize={12}
                    fill="#000000"
                    opacity={0.85}
                  />
                )}
              </Group>
            );
          })}

          {/* Lines from User to Friends*/}
          {nodes.map((friend, i) => {
            const x = (friend.relX ?? 0) * width;
            const y = (friend.relY ?? 0) * height;
            return (
              <Line
                key={`line-${i}`}
                points={[centerX, centerY, x, y]}
                stroke="#f6b092"
                strokeWidth={2}
              />
            );
          })}

          {/*Friend Bubbles*/}
          {nodes.map((friend, i) => {
            const x = (friend.relX ?? 0) * width;
            const y = (friend.relY ?? 0) * height;

            return (
              <Group
                key={`friend-${i}`}
                x={x}
                y={y}
                draggable={!pendingConnection}
                ref={(el) => (groupRefs.current[i] = el)}
                onMouseEnter={() => setHover(friend.id)}
                onMouseLeave={() => setHover(null)}

                // Prevents bubbles from going out-of-bounds
                dragBoundFunc={(pos) => {
                  const boundedX = Math.max(FRIEND_RADIUS, Math.min(width - FRIEND_RADIUS, pos.x));
                  const boundedY = Math.max(FRIEND_RADIUS, Math.min(height - FRIEND_RADIUS, pos.y));
                  const dx = boundedX - centerX;
                  const dy = boundedY - centerY;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const minDist = USER_RADIUS + FRIEND_RADIUS + 10;
                  if (dist < minDist) {
                    const current = groupRefs.current[i];
                    return current ? current.position() : { x: boundedX, y: boundedY };
                  }
                  return { x: boundedX, y: boundedY };
                }}
                onDragStart={() => (dragState.current = true)}
                onDragMove={(e) => {
                  const { x, y } = e.target.position();
                  setNodes((prev) => {
                    const updated = [...prev];
                    updated[i] = {
                      ...updated[i],
                      relX: x / width,
                      relY: y / height
                    };
                    return updated;
                  });
                }}

                // Randomizes the dragged bubble's position
                onDragEnd={(e) => {
                  dragState.current = false;
                  const { x, y } = e.target.position();
                  const draggedId = nodes[i].id;
                  const overlapped = nodes.find((node, j) => {
                    if (i === j) return false;
                    const otherX = node.relX * width;
                    const otherY = node.relY * height;
                    const dx = otherX - x;
                    const dy = otherY - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    return dist < 2 * FRIEND_RADIUS;
                  });
                  if (overlapped) {
                    setPendingConnection({ fromId: draggedId, toId: overlapped.id, originIndex: i });
                    setInput('');
                  } else {
                    setNodes((prev) => {
                      const updated = [...prev];
                      updated[i] = {
                        ...updated[i],
                        relX: x / width,
                        relY: y / height
                      };
                      return updated;
                    });
                  }
                }}
                onClick={() => {
                  if (!dragState.current) {
                    navigate(`/friend/${friend.id}`);
                  }
                }}
              >
                <Circle radius={FRIEND_RADIUS} fill="#f6d992" shadowBlur={4} />
                <Text
                  text={friend?.name || ''}
                  width={FRIEND_RADIUS * 2}
                  height={FRIEND_RADIUS * 2}
                  offsetX={FRIEND_RADIUS}
                  offsetY={FRIEND_RADIUS}
                  align="center"
                  verticalAlign="middle"
                  fontSize={12}
                  fill="#333"
                />
              </Group>
            );
          })}

          {/* User Bubble */}
          <Group x={centerX} y={centerY}>
            <Circle radius={USER_RADIUS} fill="#f6a192" shadowBlur={8} />

            <Text
              text={user?.name || ''}
              width={USER_RADIUS * 2}
              height={USER_RADIUS * 2}
              offsetX={USER_RADIUS}
              offsetY={USER_RADIUS}
              align="center"
              verticalAlign="middle"
              fontSize={14}
              fill="white"
            />
          </Group>
        </Layer>
      </Stage>

      {/*Relationship Prompt*/}
      {pendingConnection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff7f0',
            padding: '1.5rem 2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
              Enter relationship (leave blank to remove or cancel relationship):
            </p>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                marginBottom: '1rem',
                width: '100%'
              }}
            />
            <br />
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: '#f6b092',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendsGraph;
