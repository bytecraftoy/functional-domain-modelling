type UnvalidatedUserId = { readonly unvalidatedUserId: number }
type UnvalidatedBookId = { readonly unvalidatedBookId: number }

type ValidUserId = { readonly validUserId: number }
type ValidBookId = { readonly validBookId: number }

type BorrowBook = {
    readonly unvalidatedBookId: UnvalidatedBookId,
    readonly unvalidatedUserId: UnvalidatedUserId
}

type BookBorrowed = {
    readonly __typename: 'BookBorrowed',
    readonly validUserId: ValidUserId
    readonly validBookId: ValidBookId
}
type BookNotCurrentlyAvailable = {
    readonly __typename: 'BookNotCurrentlyAvailable',
    readonly validUserId: ValidUserId
    readonly validBookId: ValidBookId
}
type BookNotFound = {
    readonly unvalidatedBookId: UnvalidatedBookId
}
type UserNotFound = {
    readonly unvalidatedUserId: UnvalidatedUserId
}

type Borrowed = BookBorrowed | BookNotCurrentlyAvailable | BookNotFound | UserNotFound

type ValidateUserId = (unvalidatedUserId: UnvalidatedUserId) => ValidUserId | undefined
type ValidateBookId = (unvalidatedBookId: UnvalidatedBookId) => ValidBookId | undefined

type MarkBookBorrowed = (validUserId: ValidUserId, ValidBookId: ValidBookId) => BookBorrowed | undefined

type BorrowBookFlow =
    (validateUserId: ValidateUserId, validateBookId: ValidateBookId, markBookBorrowed: MarkBookBorrowed) =>   // dependencies
        (borrowBook: BorrowBook) => Borrowed

const borrowBookFlow: BorrowBookFlow =
    (validateUserId: ValidateUserId, validateBookId: ValidateBookId, markBookBorrowed: MarkBookBorrowed) =>
        (borrowBook: BorrowBook) => {
            let validUserId = validateUserId(borrowBook.unvalidatedUserId)
            let validBookId = validateBookId(borrowBook.unvalidatedBookId)
            if (!validUserId) {
                return { unvalidatedUserId: borrowBook.unvalidatedUserId } as UserNotFound
            } else if (!validBookId) {
                return { unvalidatedBookId: borrowBook.unvalidatedBookId } as BookNotFound
            } else {
                let borrow = markBookBorrowed(validUserId, validBookId)
                if (!borrow) {
                    return { validUserId: validUserId, validBookId: validBookId } as BookNotCurrentlyAvailable
                } else {
                    return borrow as BookBorrowed
                }
            }
        }
