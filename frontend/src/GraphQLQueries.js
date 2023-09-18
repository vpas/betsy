import { gql } from '@apollo/client';

export const GET_USER_BY_EMAIL = gql`
    query GetUserByEmail($email: String) {
        users(where: {email: {_eq: $email}}) {
            email
            id
            username
            stars
        }
    }

`

export const GET_USER_BY_ID = gql`
    query GetUserById($id: Int) {
        users(where: {id: {_eq: $id}}) {
            email
            id
            username
            stars
        }
    }

`

export const GET_USERS = gql`
    query GetUsers {
        users {
            email
            id
            username
            stars
        }
    }

`

export const GET_USER_TASKS = gql`
    query GetUserTasks($user_id: Int) {
        tasks(where: {created_by: {_eq: $user_id}}, order_by: {updated_at: desc}) {
            created_by
            description
            id
            started_at
            state
            title
            created_at
            updated_at
        }
    }
`

export const GET_TASKS = gql`
    query GetTasks {
        tasks(order_by: {updated_at: desc}) {
            created_by
            description
            id
            started_at
            state
            title
            created_at
            updated_at
        }
    }
`

export const GET_USER_BETS = gql`
    query GetUserBets($user_id: Int) {
        bets(where: {created_by: {_eq: $user_id}}, order_by: {updated_at: desc}) {
            bet_amount
            bet_condition
            created_by
            id
            task_id
            term_hours
            created_at
            updated_at
        }
    }
`

export const GET_BETS = gql`
    query GetBets {
        bets(order_by: {updated_at: desc}) {
            bet_amount
            bet_condition
            created_by
            id
            task_id
            term_hours
            created_at
            updated_at
            win_payout
            final_payout
        }
    }
`

export const GET_USER_BETS_EXTENDED = gql`
    query GetUserBetsExtended($user_id: Int) {
        bets_extended(where: {created_by: {_eq: $user_id}}, order_by: {updated_at: desc}) {
            accepted_by
            bet_amount
            bet_condition
            created_by
            id
            mirror_bet_id
            task_id
            term_hours
            created_at
            updated_at
            task_created_by
            task_title
            task_description
            task_state
            task_started_at
            task_created_at
            task_updated_at
            task_created_by_username
            bet_created_by_username
        }
    }
`

export const CREATE_TASK = gql`
    mutation CreateTask(
        $created_by: Int, 
        $description: String = "", 
        $state: String, 
        $title: String
    ) {
        insert_tasks_one(
            object: {
                created_by: $created_by, 
                description: $description, 
                state: $state, 
                title: $title
            }
        ) {
            id
        }
    }
`

export const CREATE_BET = gql`
    mutation CreateBet(
        $bet_amount: Int,
        $bet_condition: String, 
        $created_by: Int, 
        $task_id: Int, 
        $mirror_bet_id: Int = null, 
        $accepted_by: Int = null, 
        $term_hours: Int,
    ) {
        insert_bets_one(
            object: {
                bet_amount: $bet_amount, 
                bet_condition: $bet_condition, 
                created_by: $created_by, 
                task_id: $task_id, 
                mirror_bet_id: $mirror_bet_id, 
                accepted_by: $accepted_by, 
                term_hours: $term_hours,
            }
        ) {
            id
        }
    }
`

export const UPDATE_TASK_AND_BET = gql`
    mutation UpdateTaskAndBet(
        $description: String, 
        $title: String, 
        $task_id: Int!, 
        $bet_id: Int!, 
        $term_hours: Int, 
        $bet_amount: Int,
        $state: String,
    ) {
        update_tasks_by_pk(pk_columns: {id: $task_id}, _set: {title: $title, description: $description, state: $state}) {
            id
        }
        update_bets_by_pk(pk_columns: {id: $bet_id}, _set: {bet_amount: $bet_amount, term_hours: $term_hours}) {
            id
        }
    }

`
  
  