import axios from 'axios';

export default function TestErrors() {
    const baseUrl = 'http://localhost:5000/api/'

    function handleNotFound() {
        axios.get(baseUrl + 'buggy/not-found').catch(err => console.log(err.response));
    }

    function handleBadRequest() {
        axios.get(baseUrl + 'buggy/bad-request').catch(err => console.log(err.response));
    }

    function handleServerError() {
        axios.get(baseUrl + 'buggy/server-error').catch(err => console.log(err.response));
    }

    function handleUnauthorised() {
        axios.get(baseUrl + 'buggy/unauthorised').catch(err => console.log(err.response));
    }

    function handleBadGuid() {
        axios.get(baseUrl + 'activities/notaguid').catch(err => console.log(err.response));
    }

    function handleValidationError() {
        axios.post(baseUrl + 'activities', {}).catch(err => console.log(err.response));
    }

    return (
        <div className='container mx-auto pt-5'>
            <h1 className='text-2xl mb-3'>Test Error component</h1>
            <div className="join">
                <button className="btn btn-primary join-item" onClick={handleNotFound}>Not found</button>
                <button className="btn btn-warning join-item" onClick={handleBadRequest}>Bad Request</button>
                <button className="btn btn-error join-item" onClick={handleValidationError}>Validation Error</button>
                <button className="btn btn-info join-item" onClick={handleServerError}>ServerError</button>
                <button className="btn btn-secondary join-item" onClick={handleUnauthorised}>Unauthorised</button>
                <button className="btn btn-accent join-item" onClick={handleBadGuid}>Bad Guid</button>
            </div>
        </div>
    )
}