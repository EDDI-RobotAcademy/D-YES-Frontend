import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";
import { getUserList } from "page/admin/api/AdminApi";
import { UserList } from "page/user/entity/UserList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "layout/navigation/AuthConText";
import { toast } from "react-toastify";
import "./css/UserListPage.css";

const UserListPage = () => {
  const navigate = useNavigate();
  const { checkAdminAuthorization } = useAuth();
  const [userList, setUserList] = useState<UserList[]>([]);
  const isAdmin = checkAdminAuthorization();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

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
    <div className="user-list-container">
      <div className="admin-user-list-box">
        <Box
          display="flex"
          alignItems="left"
          flexDirection="column"
          minHeight="40vh"
          bgcolor="white"
          overflow="hidden" // 가로 스크롤 숨김
          margin="0 auto" // 수평 가운데 정렬
        >
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography
                gutterBottom
                style={{
                  fontSize: "20px",
                  fontFamily: "SUIT-Bold",
                  color: "#252525",
                  marginTop: "20px",
                  paddingLeft: "20px",
                }}
              >
                관리자
              </Typography>
            </div>
          </div>
          <table
            style={{
              borderCollapse: "collapse",
              textAlign: "center",
              margin: "20px",
            }}
          >
            <TableHead>
              <TableRow style={{ backgroundColor: "#F8F9FA" }}>
                <TableCell
                  style={{
                    width: "30%",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  style={{
                    width: "20%",
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  가입 채널
                </TableCell>
                <TableCell
                  style={{
                    width: "20%",
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  활동 상태
                </TableCell>
                <TableCell
                  style={{
                    width: "20%",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  계정 권한
                </TableCell>
                <TableCell
                  style={{
                    width: "10%",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  가입 일자
                </TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {userList
                ?.filter((user) => user.roleType !== null) // roleType이 null이 아닌 사용자만 필터링
                .map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.userId}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.userType}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.active === "YES" ? (
                        <Chip label="활동" color="success" />
                      ) : (
                        <Chip label="탈퇴" color="error" />
                      )}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.roleType === "MAIN_ADMIN"
                        ? "메인 관리자"
                        : "일반 관리자"}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.registeredDate
                        ? new Date(user.registeredDate)
                            .toISOString()
                            .split("T")[0]
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
            </tbody>
          </table>
        </Box>
      </div>
      <div className="normal-user-list-box">
        <Box
          display="flex"
          alignItems="left"
          flexDirection="column"
          minHeight="40vh"
          bgcolor="white"
          overflow="hidden" // 가로 스크롤 숨김
          margin="0 auto" // 수평 가운데 정렬
        >
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography
                gutterBottom
                style={{
                  fontSize: "20px",
                  fontFamily: "SUIT-Bold",
                  color: "#252525",
                  marginTop: "20px",
                  paddingLeft: "20px",
                }}
              >
                사용자
              </Typography>
            </div>
          </div>
          <table
            style={{
              borderCollapse: "collapse",
              // width: "100%",
              textAlign: "center",
              margin: "20px",
            }}
          >
            <TableHead>
              <TableRow style={{ backgroundColor: "#F8F9FA" }}>
                <TableCell
                  style={{
                    width: "30%",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  style={{
                    width: "20%",
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  가입 채널
                </TableCell>
                <TableCell
                  style={{
                    width: "20%",
                    padding: "8px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  활동 상태
                </TableCell>
                <TableCell
                  style={{
                    width: "20%",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  계정 권한
                </TableCell>
                <TableCell
                  style={{
                    width: "10%",
                    padding: "18px 16px",
                    textAlign: "center",
                    color: "#252525",
                    fontFamily: "SUIT-Bold",
                  }}
                >
                  가입 일자
                </TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {userList
                ?.filter((user) => user.roleType === null) // roleType이 null이 아닌 사용자만 필터링
                .map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.userId}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.userType}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.active === "YES" ? (
                        <Chip label="활동" color="success" />
                      ) : (
                        <Chip label="탈퇴" color="error" />
                      )}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.roleType === null ? "일반 사용자" : user.roleType}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      {user.registeredDate
                        ? new Date(user.registeredDate)
                            .toISOString()
                            .split("T")[0]
                        : ""}
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
