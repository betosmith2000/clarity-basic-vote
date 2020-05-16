;; A simple vote smart contract for 2 candidates where
;; you can vote for your favorite candidate and find out
;; who is winning!


;; Variables for candidates
(define-data-var candidate1 int 0)
(define-data-var candidate2 int 0)
(define-data-var allowVote int 1)

;; Public function to get current winner
(define-public (get-winner)
    (ok (if (is-eq (var-get candidate1) (var-get candidate2)) 0 (if (> (var-get candidate1) (var-get candidate2)) 1 2))))

;; Public function to close the vote
(define-public (get-allow-vote)
    (ok (var-get allowVote)))

;; Public function to vote for candidate 1
(define-public (vote-for-candidate1)
    (begin
        (var-set candidate1 (+ (var-get candidate1) (if (is-eq (var-get allowVote) 1) 1 0)))
        (ok (var-get candidate1))))

;; Public function to vote for candidate 2
(define-public (vote-for-candidate2)
    (begin
        (var-set candidate2 (+ (var-get candidate2) (if (is-eq (var-get allowVote) 1) 1 0)))
        (ok (var-get candidate2))))    

;; Public function to stop vote
(define-public (close-vote)
    (begin
        (var-set allowVote 0)
        (ok (var-get allowVote))))
