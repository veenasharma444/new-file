import { useEffect, useState } from "react";

import {
  userApi,
  companyApi,
  mappingApi,
  UserRecord,
  CompanyRecord,
  MappingRecord
} from "../../api/client";
import { MdDeleteOutline } from "react-icons/md";

export default function MappingMaster() {

  const [users, setUsers] =
    useState<UserRecord[]>([]);

  const [companies, setCompanies] =
    useState<CompanyRecord[]>([]);

  const [mappings, setMappings] =
    useState<MappingRecord[]>([]);

  const [userId, setUserId] =
    useState<number>(1);

  const [companyId, setCompanyId] =
    useState<number>(1);

  const loadMasterData = async () => {

    const usersData =
      await userApi.list();

    const companyData =
      await companyApi.list();

    setUsers(usersData);
    setCompanies(companyData);

    if (usersData.length > 0) {
      setUserId(
        usersData[0].user_id
      );
    }
  };

  const loadMappings = async (
    selectedUserId: number
  ) => {

    try {

      const data =
        await mappingApi.list(
          selectedUserId
        );

      setMappings(data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    loadMasterData();

  }, []);

  useEffect(() => {

    if (userId) {
      loadMappings(userId);
    }

  }, [userId]);

  const assignCompany = async () => {

    try {

      await mappingApi.create({
        user_id: userId,
        company_id: companyId
      });

      alert(
        "Mapping Created Successfully"
      );

      loadMappings(userId);

    } catch (error: any) {

      alert(
        error?.response?.data?.detail ||
        "Failed to create mapping"
      );

    }
  };

  const removeMapping = async (
    mappingId: number
  ) => {

    if (
      !window.confirm(
        "Remove mapping?"
      )
    ) {
      return;
    }

    await mappingApi.delete(
      mappingId
    );

    loadMappings(userId);
  };
  
const [isActive, setIsActive] = useState(false)
  return (
    

    <div className="container-wrapper">

      {/* <div className="card p-6 mb-6">

        <h1 className="text-3xl font-bold mb-2">
          Mapping Master
        </h1>

        <p className="text-gray-500">
          Assign companies to users.
        </p>

      </div> */}
      <div className="page-title-div">

        {/* Left Title */}
        <h5 className=" page-title">
          Mapping Master
        </h5>

        {/* Right Date */}
        <span className="right-date" style={{ fontSize: "14px" }}>
          13 January, 2024 &nbsp;&nbsp; 11:23 AM
        </span>

      </div>

      <div className="card">

        <div className="form-grid1">

          {/* User */}
          <div className="form-group">
            <label className="form-label">User*</label>
            <select
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              className="input-field"
            >
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div className="form-group">
            <label className="form-label">Company*</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(Number(e.target.value))}
              className="input-field"
            >
              {companies.map((company) => (
                <option key={company.company_id} value={company.company_id}>
                  {company.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* Button inline */}
          <div className="form-button">
            <button
              onClick={assignCompany}
              className="btn-primary"
            >
              Assign Company
            </button>
          </div>

        </div>

      </div>


      <div className="card">

        <h2 className="page-title">Mapped Companies</h2>

        <div className="table-container">

          <table className="table-custom">

            <thead>
              <tr className="table-header">
                <th>Action</th>
                <th>Company Name</th>
                <th>Company Code</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {mappings.map((mapping) => (
                <tr key={mapping.mapping_id} className="table-row">

                  {/* Action (Trash Icon) */}
                  <td>
                    <button
                      onClick={() => removeMapping(mapping.mapping_id)}
                      className="icon-btn"
                    >
                     <MdDeleteOutline />
                    </button>
                  </td>

                  <td>{mapping.company_name}</td>
                  <td>{mapping.company_code}</td>

                  {/* Status Toggle */}
                  <td>
                 

                    <button
                      onClick={() => setIsActive(!isActive)}
                      className={`toggle ${isActive ? "toggle-active" : "toggle-inactive"}`}
                    >
                      <span
                        className={`toggle-circle ${isActive ? "circle-right" : "circle-left"}`}
                      />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>


    </div>
  );
}