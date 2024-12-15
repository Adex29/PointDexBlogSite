import React, { useState, useEffect } from 'react';
import $ from 'jquery';
// import Header from '../Components/Header';
import Navigation from '../Components/Navigation';
import DateTimeNow from '../Components/DateTimeNow';
// import Footer from '../Components/Footer';
// import { useNavigate } from 'react-router-dom';
// import './Posts.css'; // Assuming you're styling the component in this file

import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import csrfToken from '../Includes/csfrToken';

const PostDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    category: 'news',
    summary: '',
    userid: '2',
    content: '',
    status: 'published',
    img: null
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleCreatePostClick = () => {
    setIsModalOpen(true);
    setCurrentPost({
      title: '',
      category: 'news',
      summary: '',
      content: '',
      status: 'published',
      img: null
    });
  };

  useEffect(() => {
    const tableElement = $('#postsTable');

    if (!$.fn.dataTable.isDataTable(tableElement)) {
      tableElement.DataTable({
        processing: true,
        ajax: {
          url: '/posts',
          type: 'GET',
          headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          },
          dataSrc: (json) => json.posts, // Update data source
        },
        columns: [
          { title: 'No', data: null, render: (data, type, row, meta) => `${meta.row + 1}` },
          { title: 'Title', data: 'title' },
          { title: 'Category', data: 'category' },
          { title: 'Status', data: 'status' },
          {
            title: 'Actions',
            data: null,
            render: (data, type, row) => `
              <button class="btn btn-primary edit-btn" data-id="${row.id}">Update</button>
              <button class="btn btn-danger delete-btn" data-id="${row.id}">Delete</button>
            `,
          },
        ],
      });
    }

    return () => {
      $('#postsTable').DataTable().destroy();
    };
  }, []);



  const handleEditPostClick = (post) => {
    setIsModalOpen(true);
    setCurrentPost(post); // For editing an existing post
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentPost({
      title: '',
      category: 'news',
      summary: '',
      content: '',
      status: 'draft',
      img: null
    });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Use currentPost instead of formData
    Object.keys(currentPost).forEach((key) => {
      data.append(key, currentPost[key]);
    });

    if (isUpdating) data.append("_method", "PUT");

    try {
      const url = isUpdating ? `/posts/${currentPost.id}` : '/posts';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          Accept: "application/json",
        },
        body: data,
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();
      setAlertMessage(result.message);

      if (result.status === "success") {
        const table = $("#postsTable").DataTable();
        table.ajax.reload(null, false);

        setTimeout(() => setAlertMessage(''), 3000);
        setCurrentPost({
          title: '',
          category: 'news',
          summary: '',
          content: '',
          status: 'published',
          img: null
        });
        setIsModalOpen(false);
        setIsUpdating(false);
      }
    } catch (error) {
      console.error("Error in submitting form:", error);
    }
  };


  const handleDeletePost = (postId) => {
    // Confirm and delete post logic
    console.log('Post deleted:', postId);
  };

  return (
    <>
      {/* <Header /> */}
      <div className="d-flex">
        <Navigation />

        <div className="container-fluid background p-0">
          <div className="text-white b-secondary w-100 py-3">
            <h3 className="text-center m-auto h-5">PointDex</h3>
          </div>

          <div id="alertContainer"></div>

          <div className="p-4">
            <div className="d-flex justify-content-between my-3">
              <h3>Posts</h3>
              <div>
                <DateTimeNow />
              </div>
            </div>
            <div className="d-flex">
              <div className="col-4 position-relative">
                <input
                  type="text"
                  placeholder="Search Posts"
                  className="form-control"
                  id="searchPostsInput"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span
                  className="clear-search"
                  id="clearPostsSearch"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </span>
              </div>
              <div className="col-2 px-3">
                <select
                  className="form-select"
                  name="filter-category"
                  id="filter-category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="all">All Categories</option>
                  <option value="news">News</option>
                  <option value="updates">Updates</option>
                  <option value="events">Events</option>
                </select>
              </div>
              <div className="ml-auto">
                <button
                  className="btn add-btn align-self-end"
                  onClick={handleCreatePostClick}
                >
                  Create Post
                </button>
              </div>
            </div>

            <div id="postsTableContainer" className="data-table-height">
              <table id="postsTable" className="table table-hover">
                {/* Render posts here */}
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Creating and Editing Post */}
      {isModalOpen && (
        <div
          className="modal fade show"
          style={{ display: 'block' }}
          tabIndex="-1"
          aria-labelledby="postModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form id="postForm" onSubmit={handlePostSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title" id="postModalLabel">Post</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div
                    id="carouselExampleSlidesOnly"
                    className="carousel slide"
                    data-interval="false"
                  >
                    <div className="carousel-inner">
                      <div className="carousel-item active" style={{ height: '500px' }}>
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            required
                            value={currentPost.title}
                            onChange={(e) =>
                              setCurrentPost({ ...currentPost, title: e.target.value })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">Category</label>
                          <select
                            className="form-select"
                            name="category"
                            id="category"
                            required
                            value={currentPost.category}
                            onChange={(e) =>
                              setCurrentPost({ ...currentPost, category: e.target.value })
                            }
                          >
                            <option value="news">News</option>
                            <option value="updates">Updates</option>
                            <option value="events">Events</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="summary" className="form-label">Summary</label>
                          <textarea
                            className="form-control"
                            id="summary"
                            name="summary"
                            required
                            value={currentPost.summary}
                            onChange={(e) =>
                              setCurrentPost({ ...currentPost, summary: e.target.value })
                            }
                          ></textarea>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">Status</label>
                          <select
                            className="form-select"
                            name="status"
                            id="status"
                            required
                            value={currentPost.status}
                            onChange={(e) =>
                              setCurrentPost({ ...currentPost, status: e.target.value })
                            }
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="img" className="form-label">Image</label>
                          <input
                            type="file"
                            className="form-control"
                            id="img"
                            name="img"
                            onChange={(e) =>
                              setCurrentPost({ ...currentPost, img: e.target.files[0] })
                            }
                          />
                        </div>
                      </div>
                      <div className="carousel-item" style={{ height: '500px' }}>
                        <div id="postContentContainer">
                          <label htmlFor="content" className="form-label">Content</label>
                          <textarea
                            className="form-control"
                            id="content"
                            name="content"
                            required
                            value={currentPost.content}
                            onChange={(e) =>
                              setCurrentPost({ ...currentPost, content: e.target.value })
                            }
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    id="prevBtn"
                    data-bs-target="#carouselExampleSlidesOnly"
                    data-bs-slide="prev"
                  >
                    Prev
                  </button>

                  <button
                    className="btn btn-secondary"
                    type="button"
                    id="nextBtn"
                    data-bs-target="#carouselExampleSlidesOnly"
                    data-bs-slide="next"
                  >
                    Next
                  </button>
                  <button type="submit" className="btn btn-success">
                    Save Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Posts */}
      <div
        className="modal fade"
        id="deletePostConfirmationModal"
        tabIndex="-1"
        aria-labelledby="deletePostConfirmationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deletePostConfirmationModalLabel">Confirm Deletion</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this post? This action cannot be undone.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDeletePost(currentPost?.id)}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default PostDashboard;
