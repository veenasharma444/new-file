import { useEffect, useState } from "react";
import {
  companyApi,
  CompanyRecord,
} from "../../api/client";

export default function CompanyMaster() {
  const [companies, setCompanies] = useState<
    CompanyRecord[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [companyName, setCompanyName] =
    useState("");

  const [companyCode, setCompanyCode] =
    useState("");

  const [editingCompanyId, setEditingCompanyId] =
    useState<number | null>(null);

  const [editCompanyName, setEditCompanyName] =
    useState("");

  const [editCompanyCode, setEditCompanyCode] =
    useState("");

  const loadCompanies = async () => {
    try {
      setLoading(true);

      const data =
        await companyApi.list();

      setCompanies(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreate = async () => {
    if (!companyName || !companyCode) {
      alert(
        "Company Name and Company Code required"
      );
      return;
    }

    try {
      await companyApi.create({
        company_name: companyName,
        company_code: companyCode,
        status: "Active",
      });

      alert(
        "Company Created Successfully"
      );

      setCompanyName("");
      setCompanyCode("");

      loadCompanies();
    } catch (error: any) {
      alert(
        error?.response?.data?.detail ||
        "Failed to create company"
      );
    }
  };

  const handleEdit = async (
    company: CompanyRecord
  ) => {
    setEditingCompanyId(
      company.company_id
    );

    setCompanyName(
      company.company_name
    );

    setCompanyCode(
      company.company_code
    );
  };

  const handleUpdate = async () => {
    if (!editingCompanyId) return;

    try {
      await companyApi.update(
        editingCompanyId,
        {
          company_name: companyName,
          company_code: companyCode,
          status: "Active",
        }
      );

      alert(
        "Company Updated Successfully"
      );

      setEditingCompanyId(null);

      setCompanyName("");
      setCompanyCode("");

      loadCompanies();

    } catch (error: any) {
      alert(
        error?.response?.data?.detail ||
        "Failed to update company"
      );
    }
  };

  //   const handleStatusToggle = async (
  //     company: CompanyRecord
  //   ) => {
  //     try {

  //       await companyApi.changeStatus(
  //         company.company_id,
  //         company.status === "Active"
  //           ? "Inactive"
  //           : "Active"
  //       );

  //       loadCompanies();

  //     } catch (error: any) {

  //       alert(
  //         error?.response?.data?.detail ||
  //         "Failed to update status"
  //       );

  //     }
  // };

  const handleStatusToggle = async (
    company: CompanyRecord
  ) => {
    try {

      const newStatus =
        company.status === "Active"
          ? "Inactive"
          : "Active";

      await companyApi.changeStatus(
        company.company_id,
        newStatus
      );

      setCompanies(prev =>
        prev.map(c =>
          c.company_id === company.company_id
            ? { ...c, status: newStatus }
            : c
        )
      );

    } catch (error: any) {

      alert(
        error?.response?.data?.detail ||
        "Failed to update status"
      );

    }
  };

  return (
    <div className="container-wrapper">

      {/* <div className="card p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Company Master
        </h1>

        <p className="text-gray-500">
          Create and manage companies.
        </p>
      </div> */}

      <div className="page-title-div">

        {/* Left Title */}
        <h5 className=" page-title">
          Company Master
        </h5>

        {/* Right Date */}
        <span className="right-date" style={{ fontSize: "14px" }}>
          13 January, 2024 &nbsp;&nbsp; 11:23 AM
        </span>

      </div>

      <div className="card">
        {/* 
        <h2 className="card-title">
          {editingCompanyId ? "Edit Company" : "Create Company"}
        </h2> */}

        <div className="form-grid1">

          <div className="form-group">
            <label className="form-label">Company Name*</label>
            <input
              type="text"
              placeholder="Type"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Code*</label>
            <input
              type="text"
              placeholder="Type"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Button inside grid */}
          <div className="form-button">
            <button
              onClick={editingCompanyId ? handleUpdate : handleCreate}
              className="btn-primary"
            >
              {editingCompanyId ? "Update Company" : "Create Company"}
            </button>
          </div>

        </div>


      </div>

      <div className="card">

        <h2 className="page-title">Company List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table-custom">

            <thead>
              <tr className="table-header">
                <th>Action</th>
                <th>Company Name</th>
                <th>Company Code</th>
                <th>Toggle Status</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((company) => (
                <tr key={company.company_id} className="table-row">

                  <td>
                    <button
                      onClick={() => handleEdit(company)}
                      className="link-btn"
                    >
                      Edit
                    </button>
                  </td>

                  <td>{company.company_name}</td>
                  <td>{company.company_code}</td>

                  <td>
                    <button
                      onClick={() => handleStatusToggle(company)}
                      className={`toggle ${company.status === "Active" ? "toggle-active" : "toggle-inactive"}`}
                    >
                      <span
                        className={`toggle-circle ${company.status === "Active" ? "circle-right" : "circle-left"}`}
                      />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>


    </div>
  );
}