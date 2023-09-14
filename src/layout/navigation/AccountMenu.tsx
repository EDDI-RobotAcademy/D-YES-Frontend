import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import { getImageUrl } from "utility/s3/awsS3";

interface AccountMenuProps {
  handleLogout: () => void;
}

export default function AccountMenu({ handleLogout }: AccountMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToMyPage = () => {
    navigate("/myPage");
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const userProfileImg = localStorage.getItem("encodedProfileImg");
  const userNickName = localStorage.getItem("encodedNickName");

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "end", marginRight: "0px" }}>
        <div style={{ minWidth: "160px" }}>{userNickName}님 안녕하세요</div>
        <Tooltip title="내 정보">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            style={{ marginLeft: "6px" }}
          >
            <Avatar
              alt="userImage"
              src={
                userProfileImg && userProfileImg.includes("://")
                  ? userProfileImg
                  : getImageUrl(userProfileImg || "")
              }
              sx={{ width: 30, height: 30 }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            goToMyPage();
            handleClose();
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography>마이페이지</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            goToCart();
            handleClose();
          }}
        >
          <ListItemIcon>
            <ShoppingCartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography>장바구니</Typography>
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            handleLogout();
            handleClose();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography>로그아웃</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
