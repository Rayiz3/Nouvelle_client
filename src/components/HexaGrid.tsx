import React, { useEffect } from "react";
import { useAccountStore } from "../system/Account";
import Hexa from "./Hexa";
import { useMainStore } from "../system/Main";

const HexaGrid: React.FC = () => {
    const curUser = useAccountStore(state => state.curUser);
    const users = useMainStore(state => state.users);
    const searchingQuery = useMainStore(state => state.searchingQuery);
    const hexPositions = useMainStore(state => state.hexPositions);

    const size = 140;
    const directions = [
      { x: -Math.sqrt(3)/2, y:  1.5 },
      { x: -Math.sqrt(3), y: 0 },
      { x: -Math.sqrt(3)/2, y: -1.5 },
      { x:  Math.sqrt(3)/2, y: -1.5 },
      { x:  Math.sqrt(3), y: 0 },
      { x:  Math.sqrt(3)/2, y:  1.5 },
    ];

    useEffect(() => {
        const filteredUsers = users.filter(user => 
            (user.email !== (curUser?.email || '')) &&
            user.name.toLowerCase().includes(searchingQuery.toLowerCase()))

        const length = filteredUsers.length;
        const result = [];
        
        if (length <= 0) {
          useMainStore.getState().setHexPosition([]);
          return;
        }
        
        let rad = 1;
        let count = 0;
        let x = Math.sqrt(3) * size, y = 0;
  
        for (let side=0; side<6; ++side) {
          for (let step=0; step<rad; ++step) {
            if (count >= length) break;
            result.push({x, y});
            x += directions[side].x * size;
            y += directions[side].y * size;
            count++;
          }
          if (side === 4) {
            if (count >= length) break;
            result.push({x, y});
            x += directions[side].x * size;
            y += directions[side].y * size;
            count++;
          }
          rad++;
        }
        useMainStore.getState().setHexPosition(result);
    }, [users, searchingQuery]);

    return (
        <div className="flex justify-center items-center relative w-full h-full">
            <div className="flex justify-center items-center absolute top-1/2 left-1/2">
                {curUser.email !== ""
                    ? <Hexa isMine={true} user={curUser} />
                    : <p className="font-pretendard font-thin">정보 없음</p>
                }
            </div>

            {users && users.length > 0 &&
                <div className="relative">
                    {users
                        .filter(user => 
                          (user.email !== (curUser?.email || '')) &&
                          user.name.toLowerCase().includes(searchingQuery.toLowerCase()))
                        .map((user, index) => {
                          const dx = hexPositions.length > 0? hexPositions[index].x : 0;
                          const dy = hexPositions.length > 0? hexPositions[index].y : 0;
                          return (
                          <div
                            key={user._id}
                            className="absolute top-1/2 left-1/2 transform"
                            style={{
                              transform: `translate(${dx}px, ${dy}px)`,
                            }}
                          >
                            <Hexa isMine={false} user={user} />
                          </div>
                      )})}
                </div>
            }
        </div>
    )
}

export default HexaGrid;