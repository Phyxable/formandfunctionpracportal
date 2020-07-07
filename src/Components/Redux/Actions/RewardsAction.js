export const setRewardsData = (data) => {
    return dispatch => {
        dispatch({
            type: "COMPLETED_REWARD",
            payload: data
        })
    }
}