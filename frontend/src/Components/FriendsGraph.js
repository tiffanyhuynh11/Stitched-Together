import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Circle, Text, Line, Group } from 'react-konva';
import useWindowSize from './useWindowSize';
import { useNavigate } from 'react-router-dom';

const USER_RADIUS = 40;
const FRIEND_RADIUS = 30;

// randomizes the position of each friend node
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
  const [originalPos, setOriginalPos] = useState({});

  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  // renders the connections
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

  const groupRefs = useRef([]);
  const dragState = useRef(false);

  useEffect(() => {
    if (!Array.isArray(friends)) return;
  
    const seen = new Set();
    const inferred = [];
  
    for (const friend of friends) {
      const ids = (friend.relationship || "")
        .split(",")
        .map(s => parseInt(s))
        .filter(Boolean);
  
      for (const targetId of ids) {
        const key = [Math.min(friend.id, targetId), Math.max(friend.id, targetId)].join("-");
        if (seen.has(key)) continue;
        seen.add(key);
        inferred.push({
          fromId: friend.id,
          toId: targetId,
        });
      }
    }
    setConnections(inferred);
  }, [friends]);
  
  // Prevent crashing due to undefined fields
  if (!user || !Array.isArray(friends) || !width || !height) return null;

  const handleSubmit = (fromId, toId, originIndex) => {
    //returns dragged node back to its OG position
    setNodes(prev => {
      const updated = [...prev];
      const orig = originalPos[fromId];
      if (orig) {
        const index = updated.findIndex(n => n.id === fromId);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            relX: orig.x / width,
            relY: orig.y / height
          };
        }
      }
      return updated;
    });
  
    // updating DB
    const friend2Id = String(toId);
    const friend1Id = String(fromId);
  
    fetch(`/friend/${fromId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relationship: friend2Id }),
    })
      .then(() => {
        return fetch(`/friend/${toId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ relationship: friend1Id }),
        });
      })
      .then(() => {
        setConnections(prev => {
          const alreadyExists = prev.some(c =>
            (c.fromId === fromId && c.toId === toId) ||
            (c.fromId === toId && c.toId === fromId)
          );
          if (alreadyExists) return prev;
  
          return [...prev, {
            fromId,
            toId,
            relationship: ''
          }];
        });
      })
      .catch(err => console.error("Error updating profile:", err));
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

            return (
              <Group key={`conn-${idx}`}>
                <Line
                  points={[x1, y1, x2, y2]}
                  stroke="#f6b092"
                  strokeWidth={2}
                  dash={[4, 2]}
                />
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
                draggable={true}
                ref={(el) => (groupRefs.current[i] = el)}

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

                // saves the position of the node before it was dragged
                onDragStart={(e) => {
                  dragState.current = true;
                  const { x, y } = e.target.position();
                  const friendId = nodes[i].id;
                  setOriginalPos(prev => ({ ...prev, [friendId]: { x, y } }));
                }}    

                // makes sure the lines move with the node          
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
                    handleSubmit(draggedId, overlapped.id, i);
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
                // navigates to the clicked friend's profile
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
    </>
  );
};

export default FriendsGraph;
