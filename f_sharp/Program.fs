type UnvalidatedUserId = UnvalidatedUserId of int
type UnvalidatedBookId = UnvalidatedBookId of int
type ValidUserId = ValidUserId of int
type ValidBookId = ValidBookId of int

type Borrowed =
    { ValidUserId: ValidUserId
      ValidBookId: ValidBookId }

type BookNotCurrentlyAvailable =
    { ValidUserId: ValidUserId
      ValidBookId: ValidBookId }

type BookNotFound = { BookId: UnvalidatedBookId }

type UserNotFound = { UserId: UnvalidatedUserId }

type BorrowFailure =
    | BookNotCurrentlyAvailable of BookNotCurrentlyAvailable
    | BookNotFound of BookNotFound
    | UserNotFound of UserNotFound

type ValidateUserId = UnvalidatedUserId -> ValidUserId option
type ValidateBookId = UnvalidatedBookId -> ValidBookId option
type MarkBookBorrowed = ValidUserId -> ValidBookId -> Borrowed option

type BorrowBook =
    ValidateUserId -> ValidateBookId -> MarkBookBorrowed -> UnvalidatedUserId -> UnvalidatedBookId -> Result<Borrowed, BorrowFailure>

let borrowBook: BorrowBook =
    fun validateUserId validateBookId markBookBorrowed unvalidatedUserId unvalidatedBookId ->
        let validUserId = validateUserId unvalidatedUserId
        let validBookId = validateBookId unvalidatedBookId

        match (validUserId, validBookId) with
        | None, _ -> Error(UserNotFound { UserId = unvalidatedUserId })
        | _, None -> Error(BookNotFound { BookId = unvalidatedBookId })
        | Some (userId), Some (bookId) ->
            match markBookBorrowed userId bookId with
            | Some (borrowed) -> Ok(borrowed)
            | None ->
                Error
                    (BookNotCurrentlyAvailable
                        { ValidUserId = validUserId.Value
                          ValidBookId = validBookId.Value })
