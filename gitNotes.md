
# Configuration
```
git config --global user.name ''
git config --global user.email ''
```

## List configrations
```
git config --list
```
# Clone & Status
For cloning a repo run this command
## 1. Clone
```
git clone [url]
```
## 2. Status
It shows the branch name with status of the code
```
git status
```

# Add & Commit

## 1. Add
    ```
    git add [fileName]
    ```
## 2. Commit
    ```
    git commit -m "meaningful message"
    ```

## 3. Push

push changes to main branch
```
git push origin main
```
# Upload already create project to github
1. Run following command in project folder to initialize it as git repo
```
git init
```
2. Create a repo at github
3. Copy the link of repo and run
    ```
    git remote add origin [link]
    ```
4. Check the branch
    ```
    git branch
    ```
5. Rename the current branch
    ```
    git branch -M main
    ```

6. Push the code to main branch
```
git push origin main
```
Note - If we we don't want to write origin main with every push we can use '-u' flag
```
git push -u origin main
```

Next Time we can use
```
git push
```

# Branch Commands
## 1. check Current branch
```
git branch
```
## 2. Rename Branch
```
git branch -M new_name
```
## 3. To navigate to other branch
```
git checkout branch_name
```
## 4. Delete Branch
```
git branch -d branch_name
```
## 5. Create New Branch
```
git checkout -b branch_name
```

# Comapre two Branches
it will compare current branch with other branch
```
git diff [other_branch_name]
```

# Merg two branches
## 1st Way: Create PR(pull request)
 go to github repo and make merge request
 ### Make pull request
after that for applying changes localy make a pull request using
```
git pull origin main
```

## 2nd Way: Command Line
 write this command
 ```
 git merge main
 ```

 resolve confilct 

 # Undo Changes

## 1. Staged Changes
```
git reset [filename]
```

## 2. Commited changes
### undo last commited changes
```
git reset HEAD~1
```
### undo multiple commited changes
```
git reset commit_hash
```
note - we can find hash by "git log" command given below
log all commits
```
git log
```

