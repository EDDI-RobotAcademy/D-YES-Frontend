import React, { useEffect, useState } from "react";
import { Box, Typography, TableHead, TableRow, TableCell } from "@mui/material";
import { getUserList } from "page/admin/api/AdminApi";
import { UserList } from "entity/user/UserList";

const UserListPage = () => {
  const [userList, setUserList] = useState([] as UserList[]);

  const fetchUserList = async () => {
    try {
      const fetchedUserList = await getUserList();
      setUserList(fetchedUserList);
    } catch (error) {
      console.log("유저 리스트 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <div>
      <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          minHeight="50vh"
          paddingTop="32px"
          paddingBottom="20px"
          bgcolor="white"
          overflow="hidden" // 가로 스크롤 숨김
          border="solid 1px lightgray"
          maxWidth="1200px" // 가로 길이 제한
          margin="0 auto" // 수평 가운데 정렬
        >
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography
                gutterBottom
                style={{
                  fontSize: "20px",
                  fontFamily: "SUIT-Medium",
                  color: "#252525",
                  marginTop: "20px",
                }}
              >
                등록된 관리자 목록
              </Typography>
            </div>
          </div>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              textAlign: "center",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    width: "300px",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Medium",
                  }}
                >
                  USERID
                </TableCell>
                <TableCell
                  style={{
                    width: "300px",
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Medium",
                  }}
                >
                  OAUTH 서비스
                </TableCell>
                <TableCell
                  style={{
                    width: "300px",
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Medium",
                  }}
                >
                  로그인 여부
                </TableCell>
                <TableCell
                  style={{
                    width: "300px",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Medium",
                  }}
                >
                  계정 권한
                </TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {userList
                ?.filter((user) => user.roleType !== null) // roleType이 null이 아닌 사용자만 필터링
                .map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {user.userId}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {user.userType}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {user.active}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {user.roleType}
                    </TableCell>
                  </TableRow>
                ))}
            </tbody>
          </table>
        </Box>
      </div>
      <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          minHeight="158.8vh"
          paddingTop="32px"
          paddingBottom="20px"
          bgcolor="white"
          overflow="hidden" // 가로 스크롤 숨김
          border="solid 1px lightgray"
          maxWidth="1200px" // 가로 길이 제한
          margin="0 auto" // 수평 가운데 정렬
        >
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography
                gutterBottom
                style={{
                  fontSize: "20px",
                  fontFamily: "SUIT-Medium",
                  color: "#252525",
                  marginTop: "20px",
                }}
              >
                등록된 유저 목록
              </Typography>
            </div>
          </div>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              textAlign: "center",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    width: "300px",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Medium",
                  }}
                >
                  USERID
                </TableCell>
                <TableCell
                  style={{
                    width: "300px",
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Medium",
                  }}
                >
                  OAUTH 서비스
                </TableCell>
                <TableCell
                  style={{
                    width: "300px",
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Medium",
                  }}
                >
                  로그인 여부
                </TableCell>
                <TableCell
                  style={{
                    width: "300px",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Medium",
                  }}
                >
                  계정 권한
                </TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {userList
                ?.filter((user) => user.roleType === null) // roleType이 null이 아닌 사용자만 필터링
                .map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {user.userId}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {user.userType}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {user.active}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {user.roleType === null ? "일반 유저" : user.roleType}
                    </TableCell>
                  </TableRow>
                ))}
            </tbody>
          </table>
        </Box>
      </div>
    </div>
  );
};

export default UserListPage;
