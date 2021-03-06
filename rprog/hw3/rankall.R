rankall <- function(outcomeType, num='best'){
  states = c('AK', 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY')
  
  dat <- data.frame(val=numeric(0), name=character(0), stringsAsFactors=FALSE)
  for (state in states){
    dat[nrow(dat) + 1,] <- rankhospital(state, outcomeType, num)
  }
  
  dat
}

rankhospital <- function(state, outcomeType, num = 'best'){
  ##read outcome data
  outcome <- read.csv("outcome-of-care-measures.csv", colClasses = "character")
  
  if (outcomeType == 'heart attack'){
    field <- 'Hospital.30.Day.Death..Mortality..Rates.from.Heart.Attack'
  } else if (outcomeType == 'heart failure'){
    field <- 'Hospital.30.Day.Death..Mortality..Rates.from.Heart.Failure'
  } else if (outcomeType == 'pneumona'){
    field <- 'Hospital.30.Day.Death..Mortality..Rates.from.Pneumona'
  } else{
    stop('invalid outcome')
  }
  
  dat <- data.frame(val=numeric(0), name=character(0), stringsAsFactors=FALSE)
  for (i in 1:nrow(outcome)){
    hos <- outcome[i,]
    val <- as.numeric(hos[[field]])
    name <- hos$Hospital.Name  
    isState <- hos$State == state
    
    if (isState && !is.na(val)){
      dat[nrow(dat) + 1,] <- c(val, as.character(name))
    }
  }
  
  #throw error if invalid state
  if (nrow(outcome) == 0){
    stop('invalid state')
  }
  
  #sort
  dat[,1] <- as.numeric(dat[,1])
  dat <- dat[with(dat, order(val, name)), ]
  
  if (num == 'best'){
    return(dat[1,]$name)
  } else if(num == 'worst'){
    return(dat[nrow(dat),]$name)
  } else{
    return(dat[num,]$name)
  }
  
  ##return hospital name in that state with lowest 30-day death rate
  dat
}