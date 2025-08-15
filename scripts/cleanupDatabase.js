const mongoose = require('mongoose');
const Team = require('../Schemas/TeamDetails');
require('dotenv').config();

const mongoURL = process.env.MONGO_URI;

async function connectToDatabase() {
    try {
        await mongoose.connect(mongoURL);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

async function backupData() {
    console.log('\n📋 Creating backup of current data...');
    try {
        const allTeams = await Team.find();
        const fs = require('fs');
        const backupData = {
            timestamp: new Date().toISOString(),
            teams: allTeams
        };
        
        // Create backup directory if it doesn't exist
        if (!fs.existsSync('./backups')) {
            fs.mkdirSync('./backups');
        }
        
        const backupFilename = `./backups/teams_backup_${Date.now()}.json`;
        fs.writeFileSync(backupFilename, JSON.stringify(backupData, null, 2));
        console.log(`✅ Backup created: ${backupFilename}`);
        return backupFilename;
    } catch (error) {
        console.error('❌ Error creating backup:', error);
        throw error;
    }
}

async function analyzeData() {
    console.log('\n🔍 Analyzing current data...');
    try {
        const allTeams = await Team.find();
        const withTeamId = allTeams.filter(team => team.teamId);
        const withoutTeamId = allTeams.filter(team => !team.teamId);
        
        console.log(`Total teams: ${allTeams.length}`);
        console.log(`Teams with teamId: ${withTeamId.length}`);
        console.log(`Teams without teamId: ${withoutTeamId.length}`);
        
        // Check for duplicates
        const duplicateMap = new Map();
        allTeams.forEach(team => {
            const key = `${team.teamName}_${team.teamLead}_${team.teamProject}`;
            if (!duplicateMap.has(key)) {
                duplicateMap.set(key, []);
            }
            duplicateMap.get(key).push(team);
        });
        
        const duplicateGroups = Array.from(duplicateMap.values()).filter(group => group.length > 1);
        console.log(`Duplicate groups found: ${duplicateGroups.length}`);
        
        return { allTeams, withTeamId, withoutTeamId, duplicateGroups };
    } catch (error) {
        console.error('❌ Error analyzing data:', error);
        throw error;
    }
}

async function removeDuplicates(duplicateGroups) {
    console.log('\n🧹 Removing duplicate entries...');
    let removedCount = 0;
    
    for (const group of duplicateGroups) {
        // Sort by creation date (using _id) and keep the one with teamId if available
        const sorted = group.sort((a, b) => {
            // Prefer entries with teamId
            if (a.teamId && !b.teamId) return -1;
            if (!a.teamId && b.teamId) return 1;
            // Then by creation date (newer first)
            return b._id.getTimestamp() - a._id.getTimestamp();
        });
        
        // Keep the first one, remove the rest
        const toKeep = sorted[0];
        const toRemove = sorted.slice(1);
        
        console.log(`Keeping team: ${toKeep.teamName} (${toKeep.teamId || 'no teamId'}) - ID: ${toKeep._id}`);
        
        for (const team of toRemove) {
            try {
                await Team.findByIdAndDelete(team._id);
                console.log(`  Removed duplicate: ID ${team._id}`);
                removedCount++;
            } catch (error) {
                console.error(`  Error removing duplicate ${team._id}:`, error.message);
            }
        }
    }
    
    console.log(`✅ Removed ${removedCount} duplicate entries`);
    return removedCount;
}

async function addMissingTeamIds() {
    console.log('\n🏷️  Adding teamId to entries without it...');
    try {
        const teamsWithoutId = await Team.find({ teamId: { $exists: false } });
        let updatedCount = 0;
        
        // Get existing teamIds to avoid conflicts
        const existingTeams = await Team.find({ teamId: { $exists: true } });
        const existingIds = new Set(existingTeams.map(t => t.teamId));
        
        for (const team of teamsWithoutId) {
            let newTeamId;
            let counter = 1;
            
            // Generate a unique teamId based on team name
            const baseName = team.teamName.toLowerCase()
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '');
            
            do {
                newTeamId = `${baseName}_${counter}`;
                counter++;
            } while (existingIds.has(newTeamId));
            
            existingIds.add(newTeamId);
            
            try {
                await Team.findByIdAndUpdate(team._id, { teamId: newTeamId });
                console.log(`  Added teamId "${newTeamId}" to team: ${team.teamName} (ID: ${team._id})`);
                updatedCount++;
            } catch (error) {
                console.error(`  Error updating team ${team._id}:`, error.message);
            }
        }
        
        console.log(`✅ Added teamId to ${updatedCount} entries`);
        return updatedCount;
    } catch (error) {
        console.error('❌ Error adding missing teamIds:', error);
        throw error;
    }
}

async function validateCleanup() {
    console.log('\n✅ Validating cleanup...');
    try {
        const allTeams = await Team.find();
        const withTeamId = allTeams.filter(team => team.teamId);
        const withoutTeamId = allTeams.filter(team => !team.teamId);
        
        console.log(`Final count - Total: ${allTeams.length}, With teamId: ${withTeamId.length}, Without teamId: ${withoutTeamId.length}`);
        
        // Check for remaining duplicates
        const duplicateMap = new Map();
        allTeams.forEach(team => {
            const key = `${team.teamName}_${team.teamLead}_${team.teamProject}`;
            if (!duplicateMap.has(key)) {
                duplicateMap.set(key, []);
            }
            duplicateMap.get(key).push(team);
        });
        
        const remainingDuplicates = Array.from(duplicateMap.values()).filter(group => group.length > 1);
        console.log(`Remaining duplicate groups: ${remainingDuplicates.length}`);
        
        // Check for unique teamIds
        const teamIdMap = new Map();
        allTeams.forEach(team => {
            if (team.teamId) {
                if (!teamIdMap.has(team.teamId)) {
                    teamIdMap.set(team.teamId, []);
                }
                teamIdMap.get(team.teamId).push(team);
            }
        });
        
        const duplicateTeamIds = Array.from(teamIdMap.values()).filter(group => group.length > 1);
        console.log(`Duplicate teamIds: ${duplicateTeamIds.length}`);
        
        if (withoutTeamId.length === 0 && remainingDuplicates.length === 0 && duplicateTeamIds.length === 0) {
            console.log('🎉 Database cleanup completed successfully!');
        } else {
            console.log('⚠️  Some issues remain - manual intervention may be needed');
        }
        
        return {
            total: allTeams.length,
            withTeamId: withTeamId.length,
            withoutTeamId: withoutTeamId.length,
            duplicates: remainingDuplicates.length,
            duplicateTeamIds: duplicateTeamIds.length
        };
    } catch (error) {
        console.error('❌ Error validating cleanup:', error);
        throw error;
    }
}

async function main() {
    console.log('🚀 Starting database cleanup process...');
    
    try {
        await connectToDatabase();
        
        // Create backup
        const backupFile = await backupData();
        console.log(`💾 Backup created: ${backupFile}`);
        
        // Analyze current state
        const analysis = await analyzeData();
        
        if (analysis.duplicateGroups.length > 0) {
            console.log(`\n🚨 Found ${analysis.duplicateGroups.length} groups of duplicates`);
            const removedCount = await removeDuplicates(analysis.duplicateGroups);
            console.log(`Removed ${removedCount} duplicate entries`);
        } else {
            console.log('\n✅ No duplicates found');
        }
        
        if (analysis.withoutTeamId.length > 0) {
            console.log(`\n🚨 Found ${analysis.withoutTeamId.length} entries without teamId`);
            const updatedCount = await addMissingTeamIds();
            console.log(`Added teamId to ${updatedCount} entries`);
        } else {
            console.log('\n✅ All entries have teamId');
        }
        
        // Validate the cleanup
        await validateCleanup();
        
    } catch (error) {
        console.error('💥 Cleanup process failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = {
    connectToDatabase,
    backupData,
    analyzeData,
    removeDuplicates,
    addMissingTeamIds,
    validateCleanup
};
