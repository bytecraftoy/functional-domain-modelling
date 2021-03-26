type UnvalidatedUserId = UnvalidatedUserId of int
type UnvalidatedBookId = UnvalidatedBookId of int
type ValidUserId = ValidUserId of int
type ValidBookId = ValidBookId of int

type BorrowBook =
    { BookId: UnvalidatedBookId
      UserId: UnvalidatedUserId }

type BookBorrowed =
    { ValidUserId: ValidUserId
      ValidBookId: ValidBookId }

type BookNotCurrentlyAvailable =
    { ValidUserId: ValidUserId
      ValidBookId: ValidBookId }

type BookNotFound = { BookId: UnvalidatedBookId }

type UserNotFound = { UserId: UnvalidatedUserId }

type Borrowed =
    | BookBorrowed of BookBorrowed
    | BookNotCurrentlyAvailable of BookNotCurrentlyAvailable
    | BookNotFound of BookNotFound
    | UserNotFound of UserNotFound

type ValidateUserId = UnvalidatedUserId -> ValidUserId option
type ValidateBookId = UnvalidatedBookId -> ValidBookId option

type MarkBookBorrowed = ValidUserId -> ValidBookId -> Borrowed option

type BorrowBookFlow =
    ValidateUserId -> ValidateBookId -> MarkBookBorrowed -> BorrowBook -> Borrowed

let borrowBookFlow: BorrowBookFlow =
    fun validateUserId validateBookId markBookBorrowed borrowBook ->
        let validUserId = validateUserId borrowBook.UserId
        let validBookId = validateBookId borrowBook.BookId

        match (validUserId, validBookId) with
        | None, _ -> UserNotFound { UserId = borrowBook.UserId }
        | _, None -> BookNotFound { BookId = borrowBook.BookId }
        | Some (userId), Some (bookId) ->
            match markBookBorrowed userId bookId with
            | Some (borrowed) -> borrowed
            | None ->
                BookNotCurrentlyAvailable
                    { ValidUserId = validUserId.Value
                      ValidBookId = validBookId.Value }
