import React, { useState, useEffect } from "react";
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
  CommentStyledInput,
  ShowModalTitle,
  HeartIcon,
  CommentBottomSection,
} from "./styles";
import {
  createTodoListApi,
  sendLikeApi,
  updateTodoListApi,
} from "../../utils/apimodule/todolist";
import { toast } from "react-toastify";
import { searchSuccessSelector } from "../../utils/recoil/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { createCommentApi } from "../../utils/apimodule/todolist";
import { showModalDataSelector } from "../../utils/recoil/atom";
import { getCurrentDate, getTomorrowDate } from "../../utils/math/date";

interface ModalProps {
  closeModal: () => void;
  modalType: string;
}

const Modal: React.FC<ModalProps> = ({ closeModal, modalType }) => {
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [content, setContent] = useState("");
  const [sharedState, setSharedState] = useState(false);
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [editShowModalState, setEditShowModalState] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchData, setSearchData]: any = useRecoilState(
    searchSuccessSelector
  );

  const [todoValue, setTodoValue]: any = useRecoilState(showModalDataSelector);

  /**
   * tomorrow면 오늘 날짜에 하루를 더하고, 아니면 오늘 날짜를 "yyyy-mm-dd"형식으로 바꾸기
   */
  let currentDate =
    modalType === "tomorrow" ? getTomorrowDate() : getCurrentDate();

  /**
   * 댓글 갯수가 2가 이상이면 댓글 스크롤 온보딩을 띄우기
   */
  useEffect(() => {
    if (
      (modalType === "showtodo" || modalType === "showAllList") &&
      todoValue.comment &&
      todoValue.comment.length >= 3
    ) {
      setShowOnboarding(true);
    }
    if (
      modalType === "searchResult" &&
      searchData.comment &&
      searchData.comment.length >= 3
    ) {
      setShowOnboarding(true);
    }
  }, [modalType, todoValue.comment, searchData.comment]);

  /**
   * 투두 작성하기
   */
  const handleCreateTodo = async () => {
    try {
      const response: any = await createTodoListApi(
        title,
        content,
        categories,
        time.substring(0, 5),
        currentDate,
        sharedState
      );
      if (response.success) {
        toast.success("글 작성이 완료되었습니다.");
        window.location.reload();
      } else {
        toast.error("글 작성이 실패하였습니다.");
      }
    } catch (error) {
      toast.error("글 작성이 실패하였습니다 : " + error);
    }
    closeModal();
  };

  /**
   * 댓글달기
   */
  const sendCommentTodo = async (id: any, type: string) => {
    try {
      const response: any = await createCommentApi(comment, id);

      if (response.success) {
        const commentMemberEmail = response.data.data;

        if (type === "show") {
          setTodoValue((prevValue: any) => ({
            ...prevValue,
            comment: Array.isArray(prevValue.comment)
              ? [
                  ...prevValue.comment,
                  {
                    commentMemberEmail,
                    comment,
                    commentTodoId: id,
                  },
                ]
              : [
                  {
                    commentMemberEmail,
                    comment,
                    commentTodoId: id,
                  },
                ],
          }));
          setComment("");
        } else {
          setSearchData((prevValue: any) => ({
            ...prevValue,
            comment: Array.isArray(prevValue.comment)
              ? [
                  ...prevValue.comment,
                  {
                    commentMemberEmail,
                    comment,
                    commentTodoId: id,
                  },
                ]
              : [
                  {
                    commentMemberEmail,
                    comment,
                    commentTodoId: id,
                  },
                ],
          }));
        }
        setComment("");
        setShowOnboarding(false);
        toast.success("댓글 작성이 완료되었습니다.");
      } else {
        toast.warning("댓글 작성이 실패하였습니다.");
      }
    } catch (error) {
      toast.error("서버가 연결되지 않았습니다.");
      console.log(error);
    }
  };

  /**
   * 수정하기 (showtodo)
   * @param todoId
   */
  const sendEditTodo = async (todoId: any) => {
    try {
      console.log(todoValue);
      const response: any = await updateTodoListApi(todoId, todoValue);
      if (response.success) {
        toast.success("수정이 완료되었습니다.");
      } else {
        toast.warning("수정이 실패하였습니다.");
      }
    } catch (error) {
      console.log("오류" + error);
    }
  };

  const handleBackdropClick = (e: any) => {
    if (!e || e.target === e.currentTarget) {
      window.location.reload();
      closeModal();
    }
  };

  const handleOnboardingClick: any = () => {
    setShowOnboarding(false);
  };

  /**
   * 좋아요
   * @param id
   */
  const onClickLike = async (id: any, type: any) => {
    try {
      const response: any = await sendLikeApi(id);
      if (response.success) {
        {
          type === "search"
            ? setSearchData((prevValue: any) => ({
                ...prevValue,
                todoLikeCheck: !prevValue.todoLikeCheck,
                todoLike: prevValue.todoLikeCheck
                  ? prevValue.todoLike - 1
                  : prevValue.todoLike + 1,
              }))
            : setTodoValue((prevValue: any) => ({
                ...prevValue,
                todoLikeCheck: !prevValue.todoLikeCheck,
                todoLike: prevValue.todoLikeCheck
                  ? prevValue.todoLike - 1
                  : prevValue.todoLike + 1,
              }));
        }
        console.log(todoValue.todoLikeCheck);
      } else {
        toast.warning("다시 시도해주세요");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const StyledComment: any = ({ comment, index }: any) => (
    <CommentContainer key={index}>
      <CommentHeader>@{comment.commentMemberEmail}</CommentHeader>
      <CommentContent>{comment.comment}</CommentContent>
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
              {!editShowModalState ? (
                <>
                  <ShowModalTopSection>
                    <ShowModalTitle>
                      <div>
                        <h2>{todoValue.todoTitle}</h2>

                        <div>
                          {todoValue.todoLikes ? (
                            <>
                              <p>{todoValue.todoLikes}</p>

                              <FontAwesomeIcon
                                icon={faHeart}
                                style={{ marginLeft: "10px", color: "red" }}
                              />
                            </>
                          ) : (
                            <>
                              <p></p>
                              <HeartIcon />
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        {todoValue.todoTime}
                        <div
                          onClick={() => {
                            setEditShowModalState(true);
                          }}
                        >
                          수정하기
                        </div>
                      </div>
                    </ShowModalTitle>
                    <div>
                      {todoValue.todoCategory
                        .split("#")
                        .filter((category: any) => category !== "")
                        .map((category: any, index: any) => (
                          <p key={index}>#{category}</p>
                        ))}
                    </div>
                    <div>{todoValue.todoContent}</div>
                  </ShowModalTopSection>
                  <ShowModalBottomSection>
                    {showOnboarding && (
                      <div
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                        onClick={handleOnboardingClick}
                      >
                        아래로 스크롤을 내려 댓글을 확인하세요!
                      </div>
                    )}
                    {todoValue.comment.map((comment: any, index: any) => (
                      <StyledComment
                        key={index}
                        comment={comment}
                        index={index}
                      />
                    ))}
                  </ShowModalBottomSection>
                </>
              ) : (
                <>
                  <ShowModalTopSection>
                    <ShowModalTitle>
                      <div>
                        <input
                          value={todoValue.todoTitle}
                          onChange={(e) => {
                            setTodoValue((prevValue: any) => ({
                              ...prevValue,
                              todoTitle: e.target.value,
                            }));
                          }}
                          style={{
                            width: "60%",
                            paddingTop: "10px",
                            outline: "none",
                            border: "none",
                            paddingLeft: "10px",
                            fontSize: "20px",
                          }}
                          placeholder={
                            todoValue.todoTitle > 0
                              ? todoValue.todoTitle
                              : "제목을 입력해주세요"
                          }
                        />
                        <div>
                          <p>{todoValue.todoLikes}</p>
                          {todoValue.todoLikes ? (
                            <>
                              <p>{todoValue.todoLikes}</p>

                              <FontAwesomeIcon
                                icon={faHeart}
                                style={{ marginLeft: "10px", color: "red" }}
                              />
                            </>
                          ) : (
                            <>
                              <p></p>
                              <HeartIcon />
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <ModalInput
                          type="time"
                          style={{
                            marginTop: "20px",
                            width: "40%",
                            paddingLeft: "20px",
                            padding: "10px",
                            outline: "none",
                            border: "none",
                          }}
                          step={3600}
                          value={todoValue.todoTime}
                          onChange={(e) => {
                            setTodoValue((prevValue: any) => ({
                              ...prevValue,
                              todoTime: e.target.value,
                            }));
                          }}
                          required
                        />
                        <div
                          onClick={() => {
                            sendEditTodo(todoValue.id);
                          }}
                        >
                          수정완료
                        </div>
                      </div>
                    </ShowModalTitle>
                    <input
                      style={{
                        border: "none",
                        padding: "15px",
                        outline: "none",
                        fontSize: "15px",
                        paddingBottom: "20px",
                        paddingTop: "20px",
                      }}
                      placeholder={
                        todoValue.todoCategory.length > 0
                          ? todoValue.todoCategory
                          : content
                      }
                      value={todoValue.todoCategory}
                      onChange={(e) => {
                        setTodoValue((prevValue: any) => ({
                          ...prevValue,
                          todoCategory: e.target.value,
                        }));
                      }}
                    />
                    <input
                      style={{
                        border: "none",
                        backgroundColor: " #f9f9f9",
                        paddingTop: "30px",
                        paddingBottom: "30px",
                        paddingLeft: "20px",
                        borderRadius: "10px",
                        outline: "none",
                        fontSize: "15px",
                        marginTop: "10px",
                      }}
                      placeholder={
                        todoValue.todoContent.length > 0
                          ? todoValue.todoContent
                          : content
                      }
                      value={todoValue.content}
                      onChange={(e) => {
                        setTodoValue((prevValue: any) => ({
                          ...prevValue,
                          todoContent: e.target.value,
                        }));
                      }}
                    />
                  </ShowModalTopSection>
                  <ShowModalBottomSection>
                    {todoValue.comment.map((comment: any, index: any) => (
                      <StyledComment
                        key={index}
                        comment={comment}
                        index={index}
                      />
                    ))}
                  </ShowModalBottomSection>
                </>
              )}
            </ShowModalContainer>
          ) : null}
        </ModalBackdrop>
      )}
      {modalType === "searchResult" && (
        <ModalBackdrop onClick={handleBackdropClick}>
          <ShowModalContainer>
            <ShowModalTopSection>
              <ShowModalTitle>
                <div style={{ paddingBottom: "10px" }}>
                  <h2>{searchData.todoTitle}</h2>

                  <div style={{ paddingBottom: "10px" }}>
                    <p>{searchData.todoLike}</p>
                    {searchData.todoLikeCheck === true ? (
                      <FontAwesomeIcon
                        icon={faHeart}
                        style={{ marginLeft: "10px", color: "red" }}
                        onClick={() => {
                          onClickLike(searchData.id, "search");
                        }}
                      />
                    ) : (
                      <HeartIcon
                        onClick={() => {
                          onClickLike(searchData.id, "search");
                        }}
                        style={{ marginLeft: "10px" }}
                      />
                    )}
                  </div>
                </div>
                <div style={{ color: "gray" }}>
                  <h4>{searchData.todoDate}</h4>
                </div>
                <div style={{ fontWeight: "bold", paddingTop: "10px" }}>
                  {searchData.todoEmail}
                </div>
              </ShowModalTitle>
              <div>
                {searchData.todoCategory
                  .split("#")
                  .filter((category: any) => category !== "")
                  .map((category: any, index: any) => (
                    <p key={index}>#{category}</p>
                  ))}
              </div>
              <div>{searchData.todoContent}</div>
            </ShowModalTopSection>
            {showOnboarding ? (
              <ShowModalBottomSection>
                <div
                  style={{
                    top: "0",
                    left: "0",
                    bottom: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: "#000",
                    fontSize: "18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    zIndex: 10,
                  }}
                  onClick={() => setShowOnboarding(false)}
                >
                  아래로 스크롤을 내려 댓글을 확인하세요!
                </div>
              </ShowModalBottomSection>
            ) : (
              <ShowModalBottomSection>
                {(searchData.comment || []).map((comment: any, index: any) => (
                  <StyledComment key={index} comment={comment} index={index} />
                ))}
              </ShowModalBottomSection>
            )}
            <CommentBottomSection>
              <CommentStyledInput
                placeholder="댓글을 입력하세요"
                onChange={(e: any) => setComment(e.target.value)}
              />
              <ModalButton
                style={{
                  padding: "20px",
                  justifyContent: "flex-end",
                  display: "flex",
                  alignSelf: "center",
                }}
              >
                <button
                  onClick={() => {
                    sendCommentTodo(searchData.id, "search");
                  }}
                >
                  추가
                </button>
              </ModalButton>
            </CommentBottomSection>
          </ShowModalContainer>
        </ModalBackdrop>
      )}
      {modalType === "showAllList" && (
        <ModalBackdrop onClick={handleBackdropClick}>
          <ShowModalContainer>
            <ShowModalTopSection>
              <ShowModalTitle>
                <div style={{ paddingBottom: "10px" }}>
                  <h2>{todoValue.todoTitle}</h2>

                  <div style={{ paddingBottom: "10px" }}>
                    <p>{todoValue.todoLike}</p>
                    {todoValue.todoLikeCheck === true ? (
                      <FontAwesomeIcon
                        icon={faHeart}
                        style={{ marginLeft: "10px", color: "red" }}
                        onClick={() => {
                          onClickLike(todoValue.id, "show");
                        }}
                      />
                    ) : (
                      <HeartIcon
                        onClick={() => {
                          onClickLike(todoValue.id, "show");
                        }}
                        style={{ marginLeft: "10px" }}
                      />
                    )}
                  </div>
                </div>
                <div style={{ color: "gray" }}>
                  <h4>{todoValue.todoDate}</h4>
                </div>
                <div style={{ fontWeight: "bold", paddingTop: "10px" }}>
                  {todoValue.todoEmail}
                </div>
              </ShowModalTitle>
              <div>
                {todoValue.todoCategory
                  .split("#")
                  .filter((category: any) => category !== "")
                  .map((category: any, index: any) => (
                    <p key={index}>#{category}</p>
                  ))}
              </div>
              <div>{todoValue.todoContent}</div>
            </ShowModalTopSection>
            {showOnboarding ? (
              <ShowModalBottomSection>
                <div
                  style={{
                    top: "0",
                    left: "0",
                    bottom: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: "#000",
                    fontSize: "18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    zIndex: 10,
                  }}
                  onClick={() => setShowOnboarding(false)}
                >
                  아래로 스크롤을 내려 댓글을 확인하세요!
                </div>
              </ShowModalBottomSection>
            ) : (
              <ShowModalBottomSection>
                {(todoValue.comment || []).map((comment: any, index: any) => (
                  <StyledComment key={index} comment={comment} index={index} />
                ))}
              </ShowModalBottomSection>
            )}
            <CommentBottomSection>
              <CommentStyledInput
                placeholder="댓글을 입력하세요"
                onChange={(e: any) => setComment(e.target.value)}
              />
              <ModalButton
                style={{
                  padding: "20px",
                  justifyContent: "flex-end",
                  display: "flex",
                  alignSelf: "center",
                }}
              >
                <button
                  onClick={() => {
                    sendCommentTodo(todoValue.id, "show");
                  }}
                >
                  추가
                </button>
              </ModalButton>
            </CommentBottomSection>
          </ShowModalContainer>
        </ModalBackdrop>
      )}
    </>
  );
};

export default Modal;
