import React, { useState } from "react";
import {
  ModalBackdrop,
  ModalBottomSection,
  ModalButton,
  ModalContainer,
  ModalInput,
  ModalTopSection,
  ShowModalBottomSection,
  ShowModalContainer,
  ShowModalTopSection,
  CommentContainer,
  CommentContent,
  CommentHeader,
  SearchModalContainer,
  SearchModalBottomSection,
  SearchModalTopSection,
  ShowModalTitle,
} from "./styles";
import { createTodoListApi } from "../../utils/apimodule/todolist";
import { toast } from "react-toastify";
import { searchSuccessSelector } from "../../utils/recoil/atom";
import { useRecoilValue } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { createCommentApi } from "../../utils/apimodule/todolist";

interface ModalProps {
  closeModal: () => void;
  modalType: string;
  todoData?: any;
  createTodo?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  closeModal,
  modalType,
  todoData,
  createTodo,
}) => {
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [content, setContent] = useState("");
  const [sharedState, setSharedState] = useState(false);
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const searchData: any = useRecoilValue(searchSuccessSelector);

  const handleCreateTodo = async () => {
    try {
      const memberId = localStorage.getItem("memberId");
      const response: any = await createTodoListApi(
        title,
        content,
        time,
        memberId
      );

      if (response.success === "true") {
        toast.success("글 작성이 완료되었습니다.");
      } else {
        toast.error("글 작성이 실패하였습니다.");
      }
    } catch (error) {
      toast.error("글 작성이 실패하였습니다 : " + error);
    }
    closeModal();
  };

  const sendCommentTodo = async () => {
    try {
      const response = await createCommentApi(comment);
      if (response.success) {
        handleBackdropClick();
        toast.success("댓글 작성이 완료되었습니다.");
      } else {
        toast.warning("댓글 작성이 실패하였습니다.");
      }
    } catch (error) {
      toast.error("서버가 연결되지 않았습니다.");
    }
  };

  const handleBackdropClick: any = (e: any) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const StyledComment: any = ({ comment, index }: any) => (
    <CommentContainer key={index}>
      <CommentHeader>@{comment.memberEmail}</CommentHeader>
      <CommentContent>{comment.commentContent}</CommentContent>
    </CommentContainer>
  );

  return (
    <>
      {(modalType === "today" ||
        modalType === "tomorrow" ||
        modalType === "showtodo") && (
        <ModalBackdrop onClick={handleBackdropClick}>
          {modalType === "today" || modalType === "tomorrow" ? (
            <ModalContainer>
              <div>
                <p onClick={closeModal}>x</p>
              </div>
              <ModalTopSection>
                <ModalInput
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <ModalInput
                  type="text"
                  placeholder="#으로 카테고리를 입력하세요"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                />
                <ModalInput
                  type="time"
                  step={3600}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </ModalTopSection>
              <ModalBottomSection>
                <ModalInput
                  type="text"
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ height: "50px" }}
                />
                <label>
                  <div>
                    <input
                      type="checkbox"
                      onChange={() => setSharedState(!sharedState)}
                    />
                    <p>공유하기</p>
                  </div>
                  <span>
                    공유하기를 선택하실 경우 다른 사람들이 검색할 수 있습니다.
                  </span>
                </label>
                <ModalButton>
                  <button onClick={handleCreateTodo}>추가</button>
                </ModalButton>
              </ModalBottomSection>
            </ModalContainer>
          ) : modalType === "showtodo" ? (
            <ShowModalContainer>
              <ShowModalTopSection>
                <ShowModalTitle>
                  <div>
                    <h2>{todoData.todoTitle}</h2>
                    <p></p>
                  </div>
                  <div>{todoData.todoTime}</div>
                </ShowModalTitle>
                <div>
                  {todoData.todoCategory
                    .split("#")
                    .filter((category: any) => category !== "")
                    .map((category: any, index: any) => (
                      <p key={index}>#{category}</p>
                    ))}
                </div>
                <div>{todoData.todoContent}</div>
              </ShowModalTopSection>
              <ShowModalBottomSection>
                {todoData.comment.map((comment: any, index: any) => (
                  <StyledComment key={index} comment={comment} index={index} />
                ))}
              </ShowModalBottomSection>
            </ShowModalContainer>
          ) : null}
        </ModalBackdrop>
      )}
      {modalType === "searchResult" && (
        <ModalBackdrop>
          <SearchModalContainer>
            <div>
              <p onClick={closeModal}>x</p>
            </div>
            <SearchModalTopSection>
              <div>
                <div>
                  <h2>{searchData.title}</h2>
                </div>
                <div>
                  <p>{searchData.likes}</p>

                  <FontAwesomeIcon
                    icon={searchData.liked ? faHeart : faHeart}
                    style={{ color: "#ff0000" }}
                  />
                </div>
              </div>
              <div>
                {searchData.categories
                  .split("#")
                  .filter((tag: any) => tag !== "")
                  .map((tag: any, index: any) => (
                    <p key={index}>#{tag}</p>
                  ))}
              </div>
              <div>{searchData.content}</div>
            </SearchModalTopSection>
            <SearchModalBottomSection>
              <div>
                <input
                  value={comment}
                  onChange={(e: any) => setComment(e.target.value)}
                  type="text"
                  placeholder="댓글을 입력하세요"
                />
                <ModalButton>
                  <button onClick={sendCommentTodo}>추가</button>
                </ModalButton>
              </div>
            </SearchModalBottomSection>
          </SearchModalContainer>
        </ModalBackdrop>
      )}
    </>
  );
};

export default Modal;
