import { useReducer } from 'react';
import axios from 'axios';
import {
  useQuery,
  useMutation
} from '@tanstack/react-query'
import {Vote, ShowVotes} from './vote'

function Match() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('http://localhost:4000/matches').then(
        (res) => res.json(),
      ),
  });

  const createMatch = async (data) => {
    const { data: response } = await axios.post('http://localhost:4000/matches', [data]);
    return response.data;
  };

  const { mutate, isLoading: postLoading } = useMutation(createMatch, {
    onSuccess: data => {
      console.log(data);
      const message = "success"
      alert(message)
    },
    onError: () => {
      alert("there was an error")
    }
  });

  const [match, dispatch] = useReducer((state, action) => ({
    ...state,
    ...action
  }), {
    team1: '',
    team2: '',
    date: ''
  });

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
   <div>
    <div className='create-match'>
      <div className="mb-3">
        <label htmlFor="team1" className="form-label">Team 1</label>
        <input type="text" className="form-control" id="team1" placeholder="Team 1" onChange={(e) => dispatch({
          team1: e.target.value
        })} value={match.team1} />
      </div>
      <div className="mb-3">
        <label htmlFor="team2" className="form-label">Team 2</label>
        <input type="text" className="form-control" id="team2" placeholder="Team 2"  onChange={(e) => dispatch({
          team2: e.target.value
        })} value={match.team2}/>
      </div>
      <div className="mb-3">
        <label htmlFor="date" className="form-label">Date</label>
        <input type="date" className="form-control" id="date" placeholder="Date" onChange={(e) => dispatch({
          date: e.target.value
        })} value={match.date}/>
      </div>
      <button type="button" className="btn btn-primary" onClick={() => mutate(match)} disabled={postLoading}>Create Match</button>
    </div>
    <hr /><hr />
      <h3>matches</h3>
      <div>
        {data.map((match, index) => {
          return <div className="card" key={index}>
          <div className="card-body">
            <h5 className="card-title">{match.team1} vs {match.team2}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{match.date}</h6>
            <p className="card-text">{match.id}</p>
          </div>
          {<Vote match={match} key={`Createvote${index}`}/>}
          {<ShowVotes id={match.id} key={`Showvote${index}`} />}
          <hr />
          <p>{`<====================================>`}</p>
          <hr />
        </div>
        
        })}
      </div>
    </div>
  )
}

export default Match
