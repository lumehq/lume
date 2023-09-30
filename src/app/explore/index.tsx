import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  ConnectionMode,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';

import { Edge } from '@app/explore/components/edge';
import { Line } from '@app/explore/components/line';
import { UserGroupNode } from '@app/explore/components/userGroupNode';
import { UserNode } from '@app/explore/components/userNode';

import { useStorage } from '@libs/storage/provider';

import { useNostr } from '@utils/hooks/useNostr';
import { getMultipleRandom } from '@utils/transform';

let id = 2;
const getId = () => `${id++}`;
const nodeTypes = { user: UserNode, userGroup: UserGroupNode };
const edgeTypes = { buttonedge: Edge };

export function ExploreScreen() {
  const { db } = useStorage();
  const { getContactsByPubkey } = useNostr();
  const { project } = useReactFlow();

  const defaultContacts = useMemo(() => getMultipleRandom(db.account.follows, 10), []);
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);

  const initialNodes = [
    {
      id: '0',
      type: 'user',
      position: { x: 141, y: 0 },
      data: { list: [], title: '', pubkey: db.account.pubkey },
    },
    {
      id: '1',
      type: 'userGroup',
      position: { x: 0, y: 200 },
      data: { list: defaultContacts, title: 'Starting Point', pubkey: '' },
    },
  ];
  const initialEdges = [{ id: 'e0-1', type: 'buttonedge', source: '0', target: '1' }];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    async (event) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();

        const id = getId();
        const prevData = nodes.slice(-1)[0];
        const randomPubkey = getMultipleRandom(prevData.data.list, 1)[0];

        const newContactList = await getContactsByPubkey(randomPubkey);
        const newNode = {
          id,
          type: 'userGroup',
          position: project({ x: event.clientX - left, y: event.clientY - top }),
          data: { list: newContactList, title: null, pubkey: randomPubkey },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id,
            type: 'buttonedge',
            source: connectingNodeId.current,
            target: id,
          })
        );
      }
    },
    [project]
  );

  return (
    <ReactFlowProvider>
      <div className="h-full w-full" ref={reactFlowWrapper}>
        <ReactFlow
          proOptions={{ hideAttribution: true }}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={Line}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          connectionMode={ConnectionMode.Loose}
          minZoom={0.8}
          maxZoom={1.2}
          fitView
        >
          <Background color="#3f3f46" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
