/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

export function ShowVotes({ id }) {
  const { isLoading, error, data } = useQuery({
    queryKey: [id],
    queryFn: () =>
    axios(`http://localhost:4001/matches/${id}/votes`).then((res) =>
        res.data
      ),
  });
  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
    {data.map((vote, index) => {
      return (
        <div className="card" key={index}>
          <div className="card-body">
            <h5 className="card-title">{vote.id}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{vote.userID}</h6>
            <p className="card-text">{vote.team}</p>
          </div>
        </div>
      );
    })}
  </div>
  )
}



// eslint-disable-next-line react/prop-types
export function Vote({ match }) {
  const createVote = async (data) => {
    const { data: response } = await axios.post(
      `http://localhost:4001/matches/${match.id}/votes`,
      data
    );
    return response.data;
  };

  const { mutate, isLoading: postLoading } = useMutation(createVote, {
    onSuccess: (data) => {
      const message = "success";
      alert(message);
    },
    onError: () => {
      alert("there was an error");
    },
  });

  const [vote, setVote] = useState("");
  const [name, setName] = useState("");
  return (
    <div>
      <h4>Votes</h4>
      <div className="create-match">
        <div className="mb-3">
          <label htmlFor={`${match.id}name`} className="form-label">
            User Name
          </label>
          <input
            type="text"
            className="form-control"
            id={`${match.id}name`}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={"voting"}
            id={`${match.id}${match.team1}`}
            onChange={() => setVote(match.team1)}
          />
          <label className="form-check-label" htmlFor={`${match.id}${match.team1}`}>
            {match.team1}
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={"voting"}
            id={`${match.id}${match.team2}`}
            onChange={() => setVote(match.team2)}
          />
          <label className="form-check-label" htmlFor={`${match.id}${match.team2}`}>
            {match.team2}
          </label>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            mutate({
              team: vote,
              userID: name,
              matchID: match.id,
            })
          }
          disabled={postLoading}
        >
          Create Vote
        </button>
      </div>
    </div>
  );
}
