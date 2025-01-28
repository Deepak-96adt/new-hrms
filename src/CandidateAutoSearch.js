import React, { useState } from "react";

const CandidateAutoSearch = ({ data, setData, candidate }) => {
  const [search, setSearch] = useState(""); // To track the search input
  const [filteredCandidates, setFilteredCandidates] = useState(candidate); // To store the filtered candidates
  const [showDropdown, setShowDropdown] = useState(false); // To toggle dropdown visibility

  const handleSearchChange = (e) => {
    setData({ ...data, email: "" });
    const value = e.target.value;
    // console.log(value);
    setSearch(value);
    const regex = new RegExp(`^${value}`, "i");
    // console.log(regex);
    const filtered = candidate.filter((user) => regex.test(user.candidateName));
    console.log(filtered);
    setFilteredCandidates(filtered);

    var status = setShowDropdown(value.trim().length > 0); // Show dropdown only if input is not empty
    // console.log(status);
  };

  const handleSelection = (user) => {
    // Update selected candidate in the state
    setData({ ...data, candidate_id: user.candidateId, email: user.emailId });
    setSearch(user.candidateName); // Set input field value to selected name
    setShowDropdown(false); // Hide dropdown
  };

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "2%",
  };

  return (
    <div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search Candidate"
        value={search}
        onChange={handleSearchChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setShowDropdown(false)}
        style={style}
      />

      {/* Dropdown for filtered candidates */}
      {showDropdown && (
        <ul
          style={{
            position: "absolute",
            maxHeight: "300px",
            overflowY: "auto",
            width: "30%",
            zIndex: 1000,
            padding: "0",
            listStyle: "none",
            margin: "0",
            border: "1px solid gray",
            backgroundColor: "white",
          }}
        >
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((user, i) => (
              <li
                key={user.candidateId}
                onMouseDown={() => handleSelection(user)}
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {filteredCandidates[i].candidateName}
              </li>
            ))
          ) : (
            <li
              className="dropdown-item text-muted"
              style={{ padding: "8px", textAlign: "center" }}
            >
              No candidates found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CandidateAutoSearch;
