import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import csrfToken from '../Includes/csfrToken';
import Navigation from '../Components/Navigation';
import DateTimeNow from '../Components/DateTimeNow';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        role: "user",
        password: "",
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        console.log(searchQuery);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        console.log(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        data.append("method", "local");
        if (isUpdating) data.append("_method", "PUT");

        try {
            const url = isUpdating ? `/users/${formData.id}` : '/users';
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
                const table = $("#usersTable").DataTable();
                table.ajax.reload(null, false);

                setTimeout(() => setAlertMessage(''), 3000);
                setFormData({
                    id: "",
                    name: "",
                    email: "",
                    role: "user",
                    password: "",
                });
                setShowModal(false);
                setIsUpdating(false);
            }
        } catch (error) {
            console.error("Error in submitting form:", error);
        }
    };

    const confirmDelete = async () => {
        if (!deleteUserId) return;

        try {
            const response = await fetch(`/users/${deleteUserId}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const table = $("#usersTable").DataTable();
                table.ajax.reload(null, false);
                setDeleteUserId(null);
            } else {
                console.error("Failed to delete user.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const tableElement = $('#usersTable');

        if (!$.fn.dataTable.isDataTable(tableElement)) {
            tableElement.DataTable({
                paging: false,
                scrollY: "400px",
                "dom": "lrtip",
                scrollCollapse: true,
                processing: true,
                ajax: {
                    url: '/users',
                    type: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                    },
                    dataSrc: (json) => json.users,
                },
                columns: [
                    { title: 'No', data: null, render: (data, type, row, meta) => `${meta.row + 1}` },
                    { title: 'Full Name', data: 'name' },
                    { title: 'Email', data: 'email' },
                    { title: 'Role', data: 'role' },
                    {
                        title: 'Actions', data: null, render: (data, type, row) => `
                            <button class="btn btn-primary edit-btn" data-id="${row.id}">Update</button>
                            <button class="btn btn-danger delete-btn" data-id="${row.id}">Delete</button>
                        `,
                    },
                ],
            });
        }
    }, []);

    useEffect(() => {
        $('#usersTable').DataTable().search(searchQuery).draw();
    }, [searchQuery]);

    useEffect(() => {
        $('#usersTable').DataTable().column(3).search(selectedCategory).draw();
    }, [selectedCategory]);

    useEffect(() => {
        $(document).on("click", ".edit-btn", function () {
            const userId = $(this).data("id");
            setIsUpdating(true);

            fetch(`/users/${userId}`, {
                method: "GET",
                headers: { "X-CSRF-TOKEN": csrfToken },
            })
                .then((response) => response.json())
                .then((data) => {
                    setFormData({
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        role: data.user.role,
                        password: "",
                    });
                    setShowModal(true);
                });
        });

        $(document).on("click", ".delete-btn", function () {
            setDeleteUserId($(this).data("id"));
        });
    }, []);

    return (
        <>
            <div className="d-flex">
                <Navigation />
                <div className="container-fluid background p-0">
                    <div className="text-white b-secondary w-100 py-3">
                        <h3 className="text-center m-auto h-5">PointDex</h3>
                    </div>

                    {alertMessage && (
                        <div className="alert alert-success alert-dismissible fade show position-absolute w-100" role="alert">
                            <strong>Success!</strong> {alertMessage}
                        </div>
                    )}

                    <div className="p-4">
                        <div className="d-flex justify-content-between my-3">
                            <h3>Users</h3>
                            <DateTimeNow />
                        </div>

                        <div className="d-flex">
                            <div className="col-4 position-relative mb-3">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="form-control"
                                    id="searchInputUser"
                                    // value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <span className="clear-search" id="clearUserSearch">
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </span>
                            </div>
                            <div className="col-2 px-3">
                                <select className="form-select" name="filter-role" id="filter-role"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}>

                                    <option selected value="">All</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <div className="ml-auto">
                                <button
                                    className="btn add-btn align-self-end"
                                    onClick={() => {
                                        setShowModal(true);
                                        setIsUpdating(false);
                                    }}
                                >
                                    Create User
                                </button>
                            </div>
                        </div>

                        <div id="usersTableContainer" className="data-table-height">
                            <table id="usersTable" className="table table-hover"></table>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Modal */}
            {showModal && (
                <div className="modal fade show d-block" id="userModal" tabIndex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form id="userForm" onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="userModalLabel">{isUpdating ? 'Update User' : 'Create User'}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            name="role"
                                            id="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isUpdating ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteUserId && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setDeleteUserId(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this user?
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setDeleteUserId(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminDashboard;
